# Sending / Receiving MIDI

Open Stage Control can send and receive midi messages using pyo / portmidi.

## Requirement

MIDI support requires additionnal softwares to be installed on the server's system:
- `python 2.7`
- [`pyo`](http://ajaxsoundstudio.com/software/pyo/) >= 0.8.3

## Setup

When running the app, the `-m / -midi` switch must be set; it accepts the following arguments (separated by spaces):
- `list`: prints the available midi inputs / outputs
- `device_name:input,output`, where:
    - `device_name`
    - `input` is the midi input number (midi message sent to open-stage-control)
    - `output` is the midi output number (midi message sent from open-stage-control)

**Linux only**

- `virtual`: (requires [`mididings`](http://das.nasophon.de/mididings/) to be installed) creates a virtual midi device. `VIRTUAL` ports number are to be used in the `device_name:input,output` declation only; ports named `OpenStageControl_In / OpenStageControl_Out` are to be connected to other ports with ALSA)

Multiple devices can be declared

## Widget settings

In order to send midi messages, a widget must have at least one `target` formatted as follow;  

`midi:device_name` (where `device_name` is one of the declared midi devices (see previous section))

## Supported commands

Here are the supported commands. One must use the `preArgs` option to make sure the correct number of arguments is sent.

| address | args | note |
|---------|------|------|
| `/note` | `channel note velocity` |  (if `velocity` is `0`, a `note off` will be sent) |
| `/control` | `channel cc   value` |  |
| `/program` | `channel program` |  |
| `/pitch` | `channel LSB MSB` |  |


- `channel` is an integer between 1 and 16
- `ǹote`, `velocity`, `cc`, `value`, `program`, `LSB`,`MSB` are integers between 0 and 127
