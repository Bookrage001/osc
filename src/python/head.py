from sys import argv, stdin, stdout, version_info, version, exit
from binascii import hexlify, unhexlify
import traceback
import json as JSON
import re

def ipc_send(name, data):
    print(JSON.dumps([name, data]))
    stdout.flush()

try:
    import rtmidi
    from rtmidi.midiconstants import *

    API = rtmidi.API_UNIX_JACK if 'jack' in argv else rtmidi.API_UNSPECIFIED
    if API is rtmidi.API_UNIX_JACK and rtmidi.API_UNIX_JACK not in rtmidi.get_compiled_api():
        API = rtmidi.API_UNSPECIFIED
        ipc_send('log', 'python-rtmidi was not compiled with jack midi support, falling back to default API')

    JACK = API == rtmidi.API_UNIX_JACK

    in_dev = rtmidi.MidiIn(API, 'MIDI->OSC probe')
    out_dev = rtmidi.MidiOut(API, 'OSC->MIDI probe')

except:
    ipc_send('log', 'ERROR: MIDI: python-rtmidi not found (or wrong version)\nRunning with python version %s' % version)
    ipc_send('log', '\nGet python-rtmidi at https://spotlightkid.github.io/python-rtmidi/')
    exit()

if version_info.major == 3:
    raw_input = input

debug = False
if 'debug' in argv:
    debug = True
