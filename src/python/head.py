from sys import argv, stdin, stdout, version_info, version, exit
from binascii import hexlify, unhexlify
import traceback
import json as JSON
import re

def ipcSend(name, data):
    print(JSON.dumps([name, data]))
    stdout.flush()

try:
    import rtmidi
    API = rtmidi.RtMidiIn.UNIX_JACK if 'jack' in argv else rtmidi.RtMidiIn.UNSPECIFIED
    JACK = API == rtmidi.RtMidiIn.UNIX_JACK
    in_dev = rtmidi.RtMidiIn(API, 'MIDI->OSC probe')
    out_dev = rtmidi.RtMidiOut(API, 'OSC->MIDI probe')
except:
    ipcSend('error', 'pyrtmidi not found (or wrong version)\nRunning with python version %s' % version)
    exit()

if version_info.major == 3:
    raw_input = input

debug = False
if 'debug' in argv:
    debug = True
