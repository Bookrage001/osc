#encoding: utf-8

from sys import argv, stdin, stdout
import json as JSON

def ipcSend(data):
    print(JSON.dumps(data))
    stdout.flush()

try:
    import pyo
except:
    raise ImportError('python-pyo module not found')

version = int(pyo.PYO_VERSION.replace('.',''))

if version < 83:
    raise ImportError('python-pyo >= 8.3.0 module is required (%s found)' % pyo.PYO_VERSION)

if not pyo.withPortmidi():
    raise ImportError('python-pyo must be built with portmidi support')


_midiOutputs = pyo.pm_get_output_devices()
_midiInputs = pyo.pm_get_input_devices()


if 'list' in argv:

    message = []

    message.append('===========')
    message.append('MIDI Inputs')
    message.append('%3i: %s' % (-1, 'null (disabled)'))

    for k in range(len(_midiInputs[0])):

        message.append('%3i: %s' % (_midiInputs[1][k], _midiInputs[0][k]))

    message.append('============')
    message.append('MIDI Outputs')
    message.append('%3i: %s' % (-1, 'null (disabled)'))

    for k in range(len(_midiOutputs[0])):

        message.append('%3i: %s' % (_midiOutputs[1][k], _midiOutputs[0][k]))


    message.append('============')

    ipcSend({
        'log': '\n'.join(message)
    })



class MidiRouter(object):

    def __init__(self, midiDevices):

        self.listener = pyo.MidiListener(self.receiveMidi, 999, True)
        self.dispatcher = pyo.MidiDispatcher(999)

        self.listener.start()
        self.dispatcher.start()

        self.midiDevicesIn = {}
        self.midiDevicesOut = {}

        for pair in midiDevices:
            name = str(pair.split(':')[0])
            i = int(pair.split(':')[1].split(',')[0])
            o = int(pair.split(':')[1].split(',')[1])

            if i not in _midiInputs[1] and i != -1:
                raise ValueError('Invalid midi input %i' % i)

            if o not in _midiOutputs[1] and o != -1:
                raise ValueError('Invalid midi output %i' % o)

            if i != -1:
                self.midiDevicesIn[i] = name

            if o != -1:
                self.midiDevicesOut[name] = o

    def receiveMidi(self, status, data1, data2, device):
        if 127 < status < 144:
            event = 'note'
            channel = status - 127
            data2 = 0

        elif 143 < status < 160:
            event = 'note'
            channel = status - 143

        elif 175 < status < 192:
            event = 'control'
            channel = status - 175

        elif 191 < status < 208:
            event = 'program'
            channel = status - 191

        else:
            return

        if device in self.midiDevicesIn:

            ipcSend({'osc':{
                'address': '/%s' % event,
                'args': [
                    {
                        'type': 'i',
                        'value': channel
                    },
                    {
                        'type': 'i',
                        'value': data1
                    },
                    {
                        'type': 'i',
                        'value': data2
                    }
                ],
                'target': ['midi:' + self.midiDevicesIn[device]]
            }})


    def sendMidi(self, device, event, *args):

        channel = int(min(max(args[0],1), 16))

        data1 = int(min(max(args[1],0), 127))
        data2 = int(min(max(args[2],0), 127))

        if 'note' in event:
            if data2 == 0:
                status = 127 + channel
            else:
                status = 143 + channel

        elif 'control' in event:
            status = 175 + channel

        elif 'program' in event:
            status = 191 + channel

        elif 'pitch' in event:
            status = 223 + channel

        else:
            return

        if device in self.midiDevicesOut:
            self.dispatcher.send(status, data1, data2, 0, self.midiDevicesOut[device])

        elif device == '*':
            self.dispatcher.send(status, data1, data2, 0, -1)



patch = []
for arg in argv:
    if type(arg) == str and ':' in arg and ',' in arg:
        patch.append(arg)

router = MidiRouter(patch)


while True:
    msg = raw_input()
    try:
        msg = JSON.loads(msg)
        msg[1] = msg[1].lower() # lower midi event type
        router.sendMidi(*msg)
    except:
        pass
