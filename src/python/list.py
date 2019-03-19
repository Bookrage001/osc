from head import *

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


if __name__ == '__main__':

    list()
