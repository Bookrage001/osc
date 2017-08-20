from sys import argv, stdin, stdout, version_info
import traceback
import json as JSON


try:
    import rtmidi
    API = rtmidi.RtMidiIn.UNIX_JACK if 'jack' in argv else rtmidi.RtMidiIn.UNSPECIFIED
    JACK = API == rtmidi.RtMidiIn.UNIX_JACK
    in_dev = rtmidi.RtMidiIn(API, 'Midi->OSC probe')
    out_dev = rtmidi.RtMidiOut(API, 'OSC->Midi probe')
except:
    ipcSend('error', 'pyrtmidi not found (or wrong version)')


if version_info.major == 3:
    raw_input = input

def ipcSend(name, data):
    print(JSON.dumps([name, data]))
    stdout.flush()

debug = False
if 'debug' in argv:
    debug = True

def list():

    message = []

    message.append('===========')
    message.append('MIDI Inputs')

    for i in range(in_dev.getPortCount()):
        message.append('%i: %s' % (i, in_dev.getPortName(i)))

    message.append('===========')
    message.append('MIDI Outputs')

    for i in range(out_dev.getPortCount()):
        message.append('%i: %s' % (i, out_dev.getPortName(i)))

    ipcSend('log', '\n'.join(message))

if 'list' in argv:
    list()

inputs = {}
outputs = {}

for arg in argv:

    if type(arg) == str and ':' in arg:

        name, ports = arg.split(':')

        inputs[name] = rtmidi.RtMidiIn(API, name if not JACK else name + '_in')
        outputs[name] = rtmidi.RtMidiOut(API, name if not JACK else name + '_out')

        if ports == 'virtual':

            try:
                inputs[name].openVirtualPort('midi_in')
                outputs[name].openVirtualPort('midi_out')
            except:
                ipcSend('error', 'can\'t open virtual port "%s"' % name)

        elif ',' in ports:

            in_port, out_port = [int(x) for x in ports.split(',')]

            if in_port >= in_dev.getPortCount():
                ipcSend('error', 'can\'t connect to input port %i' % in_port)
                break

            if out_port >= out_dev.getPortCount():
                ipcSend('error', 'can\'t connect to output port %i' % in_port)
                break

            if in_port != -1:

                try:
                    inputs[name].openPort(in_port, 'midi_in')
                except:
                    ipcSend('error', 'can\'t connect input to port %i: %s' % (in_port, in_dev.getPortName(in_port)))

            if out_port != -1:

                try:
                    outputs[name].openPort(out_port, 'midi_out')
                except:
                    ipcSend('error', 'can\'t connect to output port %i: %s' % (out_port, out_dev.getPortName(out_port)))


for name in inputs:

    def callback(midi):

        osc = {}
        osc['args'] = []
        osc['host'] = 'midi'
        osc['port'] = name

        if midi.getChannel() != 0:
            osc['args'].append({'type': 'i', 'value': midi.getChannel()})

        if midi.isNoteOn():
            osc['address'] = '/note'
            osc['args'].append({'type': 'i', 'value': midi.getNoteNumber()})
            osc['args'].append({'type': 'i', 'value': midi.getVelocity()})

        if midi.isNoteOff():
            osc['address'] = '/note'
            osc['args'].append({'type': 'i', 'value': midi.getNoteNumber()})
            osc['args'].append({'type': 'i', 'value': 0})

        if midi.isController():
            osc['address'] = '/control'
            osc['args'].append({'type': 'i', 'value': midi.getControllerNumber()})
            osc['args'].append({'type': 'i', 'value': midi.getControllerValue()})

        if midi.isProgramChange():
            osc['address'] = '/program'
            osc['args'].append({'type': 'i', 'value': midi.getProgramChangeNumber()})

        if midi.isPitchWheel():
            osc['address'] = '/pitch'
            osc['args'].append({'type': 'i', 'value': midi.getPitchWheelValue()})

        ipcSend('osc', osc)

        if debug:
            ipcSend('log','MIDI received: %s' % midi)


    def errorLoggedCallback(midi):

        try:
            callback(midi)
        except:
            ipcSend('log', 'ERROR: Midi: %s' % traceback.format_exc())

    inputs[name].setCallback(errorLoggedCallback)

def sendMidi(name, event, *args):

    if name not in outputs:
        return

    m = None

    if 'note' in event and len(args) == 3:
        if args[2] > 0:
            m = rtmidi.MidiMessage.noteOn(*args)
        else:
            m = rtmidi.MidiMessage.noteOff(args[0], args[1])

    elif 'control' in event and len(args) == 3:
        m = rtmidi.MidiMessage.controllerEvent(*args)

    elif 'program' in event and len(args) == 2:
        m = rtmidi.MidiMessage.programChange(*args)

    elif 'pitch' in event and len(args) == 2:
        m = rtmidi.MidiMessage.pitchWheel(*args)

    outputs[name].sendMessage(m)

    if debug:
        ipcSend('log','MIDI sent: %s' % m)


while True:

    try:
        msg = raw_input()
    except:
        break

    try:
        msg = JSON.loads(msg)
        msg[1] = msg[1].lower()
        sendMidi(*msg)
    except:
        ipcSend('log', 'ERROR: Midi: %s' % traceback.format_exc())
