#encoding: utf-8

from sys import argv, stdin, stdout
import json as JSON


# python -> node communication

def ipcSend(name, data):
    print(JSON.dumps([name, data]))
    stdout.flush()

# debug
debug = False
if 'debug' in argv:
    debug = True

# virtual midi port
virtuals = []
mididingsLoopbackPatch = []
mididingsInPorts = []
mididingsOutPorts = []
pyoHidden = []
pmPortPrefix = '_virtual_loopback_'
for arg in argv:
    if ':virtual' in arg:

        name = arg.split(':')[0].replace(' ','_')
        virtuals.append(name)
        pmPortname = '%s%i' % (pmPortPrefix, len(virtuals)-1)

        pyoHidden.append(pmPortname)
        pyoHidden.append('%s_in' % name)
        pyoHidden.append('%s_out' % name)

        mididingsLoopbackPatch.append('mididings.PortFilter("%s")>>mididings.Port("%s_in")' % (pmPortname, name))
        mididingsLoopbackPatch.append('mididings.PortFilter("%s_out")>>mididings.Port("%s")' % (name, pmPortname))

        mididingsInPorts.insert(0, pmPortname)
        mididingsInPorts.append('%s_in' % name)

        mididingsOutPorts.insert(0, pmPortname)
        mididingsOutPorts.append('%s_out' % name)

if len(virtuals) > 0:
        try:
            import mididings
            from threading import Thread
        except:
            ipcSend('error', 'virtual midi port requires python-mididings (linux only)')

        mididings.config(client_name='Open Stage Control', in_ports=mididingsInPorts, out_ports=mididingsOutPorts)

        for i in range(len(mididingsLoopbackPatch)):
            mididingsLoopbackPatch[i] = eval(mididingsLoopbackPatch[i])

        t = Thread(target=mididings.run, args=[mididingsLoopbackPatch])
        t.start()

# pyo import and version check

try:
    import pyo
except:
    ipcSend('error','python-pyo module not found')

version = int(pyo.PYO_VERSION.replace('.',''))

if version < 83:
    ipcSend('error','python-pyo >= 8.3.0 module is required (%s found)' % pyo.PYO_VERSION)

if not pyo.withPortmidi():
    ipcSend('error','python-pyo must be built with portmidi support')


# get midi devices

_midiOutputs = pyo.pm_get_output_devices()
_midiInputs = pyo.pm_get_input_devices()


# list midi devices

if 'list' in argv:

    message = []

    message.append('===========')
    message.append('MIDI Inputs')
    message.append('%3i: %s' % (-1, 'null (disabled)'))

    for k in range(len(_midiInputs[0])):

        if _midiInputs[0][k] in pyoHidden:
            continue

        message.append('%3i: %s' % (_midiInputs[1][k], _midiInputs[0][k]))

    message.append('============')
    message.append('MIDI Outputs')
    message.append('%3i: %s' % (-1, 'null (disabled)'))

    for k in range(len(_midiOutputs[0])):

        if _midiOutputs[0][k] in pyoHidden:
            continue

        message.append('%3i: %s' % (_midiOutputs[1][k], _midiOutputs[0][k]))


    message.append('============')

    ipcSend('log', '\n'.join(message))



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
            ports = pair.split(':')[1]

            if ports == 'virtual':
                name = name.replace(' ','_')
                n = virtuals.index(name)
                x = -1
                for i in _midiInputs[0]:
                    x += 1
                    if i == '%s%i' % (pmPortPrefix, n):
                        self.midiDevicesIn[_midiInputs[1][x]] = name
                        break
                x = -1
                for i in _midiOutputs[0]:
                    x += 1
                    if i == '%s%i' % (pmPortPrefix, n):
                        self.midiDevicesOut[name] = _midiOutputs[1][x]
                        break


            else:
                i = int(ports.split(',')[0])
                o = int(ports.split(',')[1])

                if i not in _midiInputs[1] and i != -1:
                    ipcSend('error','Invalid midi input %i' % i)

                if o not in _midiOutputs[1] and o != -1:
                    ipcSend('error','Invalid midi output %i' % o)

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

            if debug:
                ipcSend('log','MIDI received: %i %i %i \t(from: %s)' % (status, data1, data2, self.midiDevicesIn[device]))

            ipcSend('osc',{
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
            })


    def sendMidi(self, device, event, *args):

        channel = int(min(max(args[0],1), 16))

        data1 = int(min(max(args[1],0), 127))
        data2 = int(min(max(args[2],0), 127)) if len(args) >= 3 else 0

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
            if debug:
                ipcSend('log','MIDI sent: %i %i %i \t(to: %s)' % (status, data1, data2, device))


patch = []
for arg in argv:
    if type(arg) == str and ':' in arg:
        patch.append(arg)

router = MidiRouter(patch)


# listen for osc->midi commands from node through stdin

while True:
    msg = raw_input()
    try:
        msg = JSON.loads(msg)
        msg[1] = msg[1].lower()
        router.sendMidi(*msg)
    except:
        pass
