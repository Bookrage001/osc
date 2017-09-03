from sys import argv, stdin, stdout, version_info
from binascii import unhexlify
import traceback
import json as JSON
import re


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

def createCallbackFunction(name):

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

    return errorLoggedCallback

for name in inputs:

    inputs[name].setCallback(createCallbackFunction(name))

sysexRegex = re.compile(r'([^0-9A-Fa-f])\1(\1\1)*')

def midify(value, noOfBytes):
    # Convert value into noOfBytes MIDI bytes. Given a length of 2 bytes, the lower
    # 7bit of an 8bit value will go into the first byte, and the most-significant
    # bit will go into the second byte (with the left-most bit being 0 in each byte).
    # For example, 200 (11001000) will be converted into 48 40 (01001000 01000000).
    # TODO: Please note that there is no standard conversion. This specific conversion
    # may only be relevant for certain manufacturers (Keith McMillen, for example).
    currValue = int(value)
    result = []
    
    for i in range(0, noOfBytes):
        if i % 2 == 0:
            result.append(format(currValue & 0x7f, '02x'))
        else:
            result.append(format((currValue & 0x80) >> 1, '02x'))
            currValue >>= 8
            
    return ''.join(result)

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

    elif 'sysex' in event:
        # rtmidi.MidiMessage(unhexlify('f0 7e 7f 06 01 f7')) creates a sysex message
        # from hex MIDI data string 'f0 7e 7f 06 01 f7'.
        # We expect args[0] to be a string of the form 'f0 7e 7f 06 01 f7', and
        # args[1..n] to be integer values. Strings of the form 'nn' in args[0] are
        # then replaced using midified args[1..n] to create the final data string.
        midiBytes = args[0].replace(' ', '')
        i = 1
        for m in sysexRegex.finditer(midiBytes):
            midiBytes = midiBytes[:m.start()] + midify(args[i], (m.end() - m.start()) // 2) + midiBytes[m.end():]
            i += 1

        if debug:
            ipcSend('log', 'Sysex string: %s' % midiBytes)

        m = rtmidi.MidiMessage(unhexlify(midiBytes))

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
