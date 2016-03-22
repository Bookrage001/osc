[![Build Status](https://travis-ci.org/jean-emmanuel/open-stage-control.svg?branch=master)](https://travis-ci.org/jean-emmanuel/open-stage-control)

## Open Stage Control

Open Stage Control is a libre desktop OSC bi-directionnal control surface application. It's built with HTML, JavaScript & CSS on top of [Electron](http://electron.atom.io/) framework.

### Demo

You can try the app here http://openstagecontrol.herokuapp.com/

Please note that :
- Chrome/Chromium **49** at least is required
- Since there is only one instance running, all connected guests are synchronized (widgets using the same osc paths update each other's states) : you might experience some unwanted synchronization with other users unless you specify custom parameters for your widgets.
- You might want to download the examples sessions files under *examples/* and load them in the app to get started.


### Features
- mouse & multi-touch sensitive widgets
- modular & responsive layout
- built-in live editor
- bi-directionnal osc bindings
- headless server mode with any number of clients using chromium
- app state store / recall & import / export
- themes !

### Getting started

Prebuilt binaries for Linux, Windows and OS X can be found on the [release](https://github.com/jean-emmanuel/open-stage-control/releases) page. If you want to build or run the app from sources, here's how to:
- [Build from sources](resources/docs/build-from-sources.md)
- [Run from sources](resources/docs/run-from-sources.md)

**Command line switches**
```
Options:
  -h, --help     display help
  -s, --sync     synchronized hosts (ip:port pairs) (all osc messages will also be sent to these)
  -l, --load     session file to load
  -p, --port     osc input port (for synchronization)
  -n, --nogui    disable default gui and makes the app availabe through http on specified port
  -t, --theme    theme name or path (mutliple values allowed)

Exemples:

$ open-stage-control -s 127.0.0.1:5555 127.0.0.1:6666 -p 7777

This will create an app listening on port 7777 for synchronization messages, and sending its widgets state changes to ports 5555 and 6666.

$ open-stage-control -n 8080 -l path/to/session.js

This will create a headless app available through http on port 8080. Multiple clients can use the app (with chrome only) simultaneously, their widgets will be synchronized.


$ open-stage-control -t light noinput /path/to/custom_theme.css

This will apply three themes (light ui, remove all inputs, and a custom theme file)


Available themes:
- light
- noinput
```

### Documentation

- [Editor reference](resources/docs/editor-reference.md)
- [Session reference](resources/docs/session-reference.md)
- [Widgets reference](resources/docs/widgets-reference.md)
- [Theming](resources/docs/theming.md)

### License & credits

Copyleft © Jean-Emmanuel @ [AMMD](http://ammd.net). This program is released under the GNU/GPL3 license.

It relies on the use of several libraries :
- [Node.js](https://nodejs.org/)
- [Electron](http://electron.atom.io/)
- [node-osc](https://github.com/TheAlphaNerd/node-osc)
- [socket.io]()
- [browserify]()
- [express]()
- [node-sass](https://github.com/sass/node-sass)
- [jQuery](http://jquery.com/)
- [jQuery-UI](http://jqueryui.com/) (draggable, resizable & sortable)
- [Font Awesome](http://fontawesome.io/)
