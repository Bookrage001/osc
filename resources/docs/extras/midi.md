# Sending / Receiving MIDI

Open Stage Control can send and receive MIDI messages.

## Requirements

MIDI support requires additional software to be installed on the server's system:

- python (2 / 3)
- python package [rtmidi](https://pypi.python.org/pypi/rtmidi) (version 2.3.2)

!!! note "Why an additionnal dependency ?"
    Providing cross-platform MIDI support is not trivial, as it requires OS-specific compilation that cannot be automated within Open Stage Control's current packaging workflow. Using a python addon seems to be the best compromise so far : the core app remains easy to build, and the extra dependency is easy to install.

## Setup

When running the app, the `-m / --midi` switch must be set; it accepts the following options (separated by spaces):

- `list`: prints the available MIDI ports to the console; numbers in the first column may be used for `input`/`output` definition below
- `device_name:input,output`: connect to midi ports `input` and `output`; osc messages sent to target `midi:device_name` will be processed as midi events; Multiple devices can be declared

*Linux only:*

- `device_name:virtual`: creates a virtual midi device with one input port and one output port
- `jack`: use JACK MIDI instead of ALSA (add as extra parameter). `rtmidi` must be compiled with `--jack-midi` flag for this to work.

## Widget settings

In order to send MIDI messages, a widget must have at least one `target` formatted as follows:

`midi:device_name` (where `device_name` is one of the declared midi devices)

## Supported MIDI messages

!!! warning ""
    Define static argument values using the [`preArgs`](/widgets/widgets/#preargs) option in order to complete the respective MIDI message.



### `/note channel note velocity`

NoteOn event or noteOff if velocity equals `0`.

- `channel`: integer between 1 and 16
- `note`: integer between 0 and 127
- `velocity`: integer between 0 and 127

Example:

A push button might be configured as follows in order to send a MIDI note whose velocity is defined by the button's on/off value:

- `address`: /note
- `preArgs`: [1, 60] (for MIDI channel 1, and note 60 / C3)
- `on`: 100 (for noteOn velocity of 100 on button push)
- `off`: 0 (to send a noteOff on button release)
- `target`: ["midi:device_name"] (where device_name is one of the declared midi devices defined during [setup](#setup))

### `/control channel cc value`

Control change event.

- `channel`: integer between 1 and 16
- `cc`: integer between 0 and 127
- `value`: integer between 0 and 127

Example:

A fader might be configured as follows in order to send a MIDI control message (a volume control in this example):

- `address`: /control
- `pre-args`: [1, 7] (MIDI channel 1, control number 7 generally used as volume control)
- `range`: {"min": 0, "max": 127} (MIDI values are encoded in this range)
- `target`: ["midi:device_name"]

### `/program channel program`

Program change event.

- `channel`: integer between 1 and 16
- `program`: integer between 0 and 127

### `/pitch channel pitch`

PitchWheel event.

- `channel`: integer between 1 and 16
- `pitch`: integer between 0 and 16383

### `/sysex msg v1 .. vN`

System exclusive message.

- `msg`: hexadecimal sysex data string of the form `f0 ... f7`. You may include placeholders of the form `nn` which will be replaced by `v1, .., vN` respectively.
- `v1, .., vN`: values encoded as hexadecimal data strings to include in `msg`. Most probably, you will need to sepcify a [custom module](/extras/custom-module/) in order to convert numeric widget values into the required hexadecimal format. In general, this conversion will be different for each manufacturer / device.

For a very simple example, refer to session 'sysex.json' found in the application's sub folder 'resources/app/examples/'. Please remember to adjust the button's `target` to the `device_name` used in your MIDI setup.
