from head import *
from list import *

if 'list' in argv:
    list()

inputs = {}
outputs = {}

for arg in argv:

    if type(arg) == str and ':' in arg:

        name, ports = arg.split(':')

        inputs[name] = rtmidi.MidiIn(API, name if not JACK else name + '_in')
        outputs[name] = rtmidi.MidiOut(API, name if not JACK else name + '_out')

        if ports == 'virtual':

            try:
                inputs[name].open_virtual_port('midi_in')
                outputs[name].open_virtual_port('midi_out')
            except:
                ipc_send('error', 'can\'t open virtual port "%s"' % name)

        elif ',' in ports:

            in_port, out_port = [int(x) for x in ports.split(',')]

            if in_port >= in_dev.get_port_count():
                ipc_send('error', 'can\'t connect to input port %i' % in_port)
                break

            if out_port >= out_dev.get_port_count():
                ipc_send('error', 'can\'t connect to output port %i' % in_port)
                break

            if in_port != -1:

                try:
                    inputs[name].open_port(in_port, 'midi_in')
                except:
                    ipc_send('error', 'can\'t connect input to port %i: %s' % (in_port, in_dev.get_port_name(in_port)))

            if out_port != -1:

                try:
                    outputs[name].open_port(out_port, 'midi_out')
                except:
                    ipc_send('error', 'can\'t connect to output port %i: %s' % (out_port, out_dev.get_port_name(out_port)))


MIDI_TO_OSC = {
    NOTE_ON: '/note',
    NOTE_OFF: '/note',
    CONTROL_CHANGE: '/control',
    PROGRAM_CHANGE: '/program',
    PITCH_BEND: '/pitch',
    SYSTEM_EXCLUSIVE: '/sysex'
}

def create_callback(name):

    def callback(event, data):

        osc = {}
        osc['args'] = []
        osc['host'] = 'midi'
        osc['port'] = name

        message, deltatime = event
        mtype = message[0] & 0xF0

        if mtype in MIDI_TO_OSC:

            osc['address'] = MIDI_TO_OSC[mtype]

            if mtype is SYSTEM_EXCLUSIVE:
                # Parse the provided data into a hex MIDI data string of the form  'f0 7e 7f 06 01 f7'.
                v = ' '.join([hex(x).replace('0x', '').zfill(2) for x in message])
                osc['args'].append({'type': 'string', 'value': v})

            else:

                status = message[0]
                channel = (status & 0xF) + 1

                osc['args'].append({'type': 'i', 'value': channel})

                if mtype == NOTE_OFF:
                    message[2] = 0

                for data in message[1:]:
                    osc['args'].append({'type': 'i', 'value': data})


            ipc_send('osc', osc)

            if debug:
                ipc_send('log','MIDI received: %s' % message)


    def callback_error_wrapper(event, data):

        try:
            callback(event, data)
        except:
            ipc_send('log', 'ERROR: MIDI: %s' % traceback.format_exc())

    return callback_error_wrapper

for name in inputs:

    inputs[name].set_callback(create_callback(name))

    # Activate sysex support
    if 'sysex' in argv:
        inputs[name].ignore_types(False, False, True)


def midi_message(status, channel, data1=None, data2=None):

    msg = [(status & 0xF0) | (channel - 1 & 0xF)]

    if data1 is not None:
        msg.append(data1 & 0x7F)

        if data2 is not None:
            msg.append(data2 & 0x7F)

    return msg


sysexRegex = re.compile(r'([^0-9A-Fa-f])\1(\1\1)*')

def send_midi(name, event, *args):

    if name not in outputs:
        ipc_send('log','ERROR: MIDI: unknown output (%s)' % name)
        return

    m = None

    if 'note' in event and len(args) == 3:
        args = [int(round(x)) for x in args]
        if args[2] > 0:
            m = midi_message(NOTE_ON, args[0], args[1], args[2])
        else:
            m = midi_message(NOTE_OFF, args[0], args[1])

    elif 'control' in event and len(args) == 3:
        args = [int(round(x)) for x in args]
        m = midi_message(CONTROL_CHANGE, *args)

    elif 'program' in event and len(args) == 2:
        args = [int(round(x)) for x in args]
        m = midi_message(PROGRAM_CHANGE, *args)

    elif 'pitch' in event and len(args) == 2:
        args = [int(round(x)) for x in args]
        channel = args[0]
        value = args[1]
        m = midi_message(PITCH_BEND, channel, value & 0x7f, (value >> 7) & 0x7f)

    elif 'sysex' in event:
        # unhexlify('f0 7e 7f 06 01 f7') creates a sysex message
        # from hex MIDI data string 'f0 7e 7f 06 01 f7'.
        # We expect all args to be hex strings! args[0] may contain placeholders of
        # the form 'nn' that are replaced using args[1..N] to create the final message.
        midiBytes = args[0].replace(' ', '')
        i = 1
        for m in sysexRegex.finditer(midiBytes):
            midiBytes = midiBytes[:m.start()] + args[i].replace(' ', '') + midiBytes[m.end():]
            i += 1

        msg = unhexlify(midiBytes)

        if (msg and msg.startswith(b'\xF0') and msg.endswith(b'\xF7') and
                all((val <= 0x7F for val in msg[1:-1]))):
            m = msg
        else:
            ipc_send('log', 'ERROR: MIDI: Invalid sysex string: %s' % msg)

    if m is None:

        ipc_send('log','ERROR: MIDI: could not convert osc args to midi message (%s %s)' % (event, " ".join([str(x) for x in args])))

    else:

        outputs[name].send_message(m)

        if debug:

            if 'sysex' in event:
                repr = 'sysex: %s' % [int(x) for x in m]
            else:
                repr = 'status=%s' % m[0]
                repr += ', data1=%s' % m[1]
                if len(m)==3:
                    repr += ', data2=%s' % m[2]

            ipc_send('log','MIDI sent: %s' % repr)


while True:

    try:
        msg = raw_input()
    except:
        break

    try:
        msg = JSON.loads(msg)
        msg[1] = msg[1].lower()
        send_midi(*msg)
    except:
        ipc_send('log', 'ERROR: MIDI: %s' % traceback.format_exc())
