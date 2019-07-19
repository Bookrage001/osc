from head import *

MIDI_TO_OSC = {
    NOTE_ON: '/note',
    NOTE_OFF: '/note',
    CONTROL_CHANGE: '/control',
    PROGRAM_CHANGE: '/program',
    PITCH_BEND: '/pitch',
    SYSTEM_EXCLUSIVE: '/sysex'
}

OSC_TO_MIDI = {
    '/note': NOTE_ON,
    '/control': CONTROL_CHANGE,
    '/program': PROGRAM_CHANGE,
    '/pitch': PITCH_BEND,
    '/sysex': SYSTEM_EXCLUSIVE
}

def midi_str(message):

    mtype = message[0] & 0xF0
    s = 'UNKNOWN'

    if mtype is SYSTEM_EXCLUSIVE:

        s = 'SYSTEM_EXCLUSIVE: sysex=%s' % ' '.join([hex(x).replace('0x', '').zfill(2) for x in message])

    else:

        status = message[0]
        channel = (status & 0xF) + 1

        try:

            if mtype is NOTE_ON:
                s = 'NOTE_ON: channel=%i, note=%i, velocity=%i' % (channel, message[1], message[2])
            elif mtype is NOTE_OFF:
                s = 'NOTE_OFF: channel=%i, note=%i' % (channel, message[1])
            elif mtype is CONTROL_CHANGE:
                s = 'CONTROL_CHANGE: channel=%i, cc=%i, value=%i'% (channel, message[1], message[2])
            elif mtype is PROGRAM_CHANGE:
                s = 'PROGRAM_CHANGE: channel=%i, program=%i' % (channel, message[1])
            elif mtype is PITCH_BEND:
                s = 'PITCH_BEND: channel=%i, pitch=%i' % (channel, message[1] + message[2] * 128 if len(message) == 3 else message[1])

        except IndexError:

            s = 'NONE (ERROR: wrong number of argument for %s)' % MIDI_TO_OSC[mtype]

    return s
