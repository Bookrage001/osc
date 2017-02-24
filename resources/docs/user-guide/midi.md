# Sending / Receiving MIDI

Open Stage Control can send and receive midi messages using pyo / portmidi.

## Requirement

MIDI support requires additionnal softwares to be installed on the server's system:
- `python 2.7`
- [`pyo`](http://ajaxsoundstudio.com/software/pyo/) >= 0.8.3

## Usage

#### Setup

When running the app, the `-m / -midi` must be set; it accepts the following arguments (separated by spaces):
- `list`: prints the available midi inputs / outputs
- `device_name:input,output`, where:
    - `device_name`
    - `input` is the midi input id (midi message sent to open-stage-control)
    - `output` is the midi output id (midi message sent from open-stage-control)

#### Widget settings

Widgets that have their target set as following will have their messages interpreted as midi commands:

- `target`: `[midi:client_name]`

Here are the supported commands. One must use the `preArgs` option to make sure the correct number of arguments is sent.


`/note    channel note velocity` (if `velocity` is `0`, a `note off` will be sent)
`/control channel cc   value`
`/program channel program`
`/pitch   channel LSB MSB`

Where:

- `channel` is an integer between 1 and 16
- `ǹote`, `velocity`, `cc`, `value`, `program`, `LSB`,`MSB`
