# <img src="https://github.com/jean-emmanuel/open-stage-control/blob/master/resources/images/logo.png" height="80px"/> Open Stage Control

Open Stage Control is a libre desktop OSC bi-directionnal control surface application. It's built with HTML, JavaScript & CSS and run as a Node / [Electron](http://electron.atom.io/) web server that accepts any number of Chrome / Chromium / Electron clients.

## Documentation

[Read the documentation](http://osc.ammd.net)

*The docs' sources are located in [resources/](https://github.com/jean-emmanuel/open-stage-control/blob/master/resources)*

## Download

Prebuilt binaries for Linux, Windows and OS X can be found on the [release](https://github.com/jean-emmanuel/open-stage-control/releases) page.

## Demo

You can try the app here [http://openstagecontrol.herokuapp.com/](http://openstagecontrol.herokuapp.com/)

Please note that :

- Chrome/Chromium **49** at least is required
- Since there is only one instance running, all connected guests are synchronized (widgets using the same osc paths update each other's states) : you might experience some unwanted synchronization with other users unless you specify custom parameters for your widgets.
- You might want to download the examples sessions files under *examples/* and load them in the app to get started.


## Features

- multiplatform desktop server application with built-in client interface
- mouse & multitouch interfaces compatible with **Chrome 49** or later
- all the widgets you need !
- built-in live editor
- clients synchronization
- deep customization possibilities such as theming and messages filtering
- *true* control over what the widgets send

## Supported platforms

Same as [Electron's supported platforms](https://github.com/electron/electron/blob/master/docs/tutorial/supported-platforms.md)


## License & credits

Copyleft © Jean-Emmanuel @ [AMMD](http://ammd.net). This program is released under the GNU/GPL3 license.

It relies on the use of several libraries :

- [Node.js](https://nodejs.org/)
- [Electron](http://electron.atom.io/)
- [osc.js](https://github.com/colinbdclark/osc.js)
- [socket.io](http://socket.io)
- [browserify](http://browserify.org)
- [exorcist](https://github.com/thlorenz/exorcist)
- [express](http://expressjs.com)
- [node-sass](https://github.com/sass/node-sass)
- [jQuery](http://jquery.com/)
- [jQuery-UI](http://jqueryui.com/) (draggable, resizable & sortable)
- [Font Awesome](http://fontawesome.io/)
- [source-map](https://github.com/mozilla/source-map)
