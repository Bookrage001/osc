# Sending / Receiving MIDI

Open Stage Control can send and receive midi messages using a tiny python addon.

## Requirements

MIDI support requires additionnal softwares to be installed on the server's system:

- python (2 / 3)
- python package [rtmidi](https://pypi.python.org/pypi/rtmidi) (2.3.2)

!!! note "Why an additionnal dependency ?"
    Providing cross-platform midi support is not trivial, as it requires os-specific compilations that cannot be automated within Open Stage Control's current packaging workflow. Using a python addon seems the best compromise so far : the core app remains easy to build, and the extra dependency is easy to install.

## Setup

When running the app, the `-m / -midi` switch must be set; it accepts the following options (separated by spaces):

- `list`: prints the available midi ports to the consolle
- `device_name:input,output`: connect to midi ports `input` and `output`; osc messages sent to target `midi:device_name` will be processed as midi events; Multiple devices can be declared

*Linux only:*

- `device_name:virtual`: creates a virtual midi device with one input port and one output port
- `jack`: use jack-midi instead of alsa (pyrtmidi midi must be compiled with the `--jack-midi` flag in order to make this work)

## Widget settings

In order to send midi messages, a widget must have at least one `target` formatted as follow;  

`midi:device_name` (where `device_name` is one of the declared midi devices)

## Supported events

!!! warning ""
    Use the [`preArgs`](/widgets/widgets/#preargs) option to make sure the correct number of arguments is sent.



### `/note channel note velocity`

NoteOn event or noteOff if velocity equals `0`.

- `channel`: integer between 1 and 16
- `note`: integer between 0 and 127
- `velocity`: integer between 0 and 127

### `/control channel cc value`

Control change event.

- `channel`: integer between 1 and 16
- `cc`: integer between 0 and 127
- `value`: integer between 0 and 127

### `/program channel program`

Program change event.

- `channel`: integer between 1 and 16
- `program`: integer between 0 and 127

### `/pitch channel pitch`

PitchWheel event.

- `channel`: integer between 1 and 16
- `pitch`: integer between 0 and 16383
