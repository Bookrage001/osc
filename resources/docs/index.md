<div class="well">
    <p class="text-center">
        <img src="img/logo.png" height="80px" class="img-circle"/>
    </p>


    <p class="text-center">
        Open Stage Control is a libre desktop OSC bi-directionnal control surface application. It's built with HTML, JavaScript & CSS and run as a Node / <a href="http://electron.atom.io/">Electron</a> web server that accepts any number of Chrome / Chromium / Electron clients.
    </p>

    <br/>

    <div class="">
    <a class="btn btn-default btn-sm pull-right" href="https://github.com/jean-emmanuel/open-stage-control"><i class="fa fa-star fa-fw"></i> <span  id="github-stars">...</span></a>
    <a class="btn btn-primary btn-sm" href="https://github.com/jean-emmanuel/open-stage-control/releases"><i class="fa fa-linux fa-fw"></i><i class="fa fa-apple fa-fw"></i><i class="fa fa-windows fa-fw"></i> Latest release (<span id="github-version">...</span>)</a>
    <a class="btn btn-info btn-sm" href="http://openstagecontrol.herokuapp.com/"><i class="fa fa-chrome fa-fw"></i> Demo (chrome 49+ required)</a>
    </div>
</div>



## Features

- multiplatform desktop server application with built-in client interface
- mouse & multitouch interfaces compatible with **Chrome 49** or later
- all the widgets you need !
- built-in live editor
- clients synchronization
- deep customization possibilities such as theming and messages filtering
- *true* control over what the widgets send
- midi inputs/outputs

## Supported platforms

The server can run on all [platforms supported by Electron](https://github.com/electron/electron/blob/master/docs/tutorial/supported-platforms.md). Any client that can run chrome browser can connect to the server.


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
- [mathjs](http://mathjs.org/)


## Documentation

- [Getting started](getting-started/)
    - [Session File / Tabs](user-guide/session-file/)
    - [Interface / Editor](user-guide/interface/)
    - [Remote Control](user-guide/remote-control/)
    - [Theming](user-guide/theming/)
    - [Midi](user-guide/midi/)
    - [Custom Module](user-guide/custom-module/)

- [Widgets Generics](user-guide/widgets-generics/)
    - [Buttons](user-guide/widgets-specifics/buttons/)
    - [Sliders](user-guide/widgets-specifics/sliders/)
    - [Pads](user-guide/widgets-specifics/pads/)
    - [Containers](user-guide/widgets-specifics/containers/)
    - [Matrices](user-guide/widgets-specifics/matrices/)
    - [Switchers](user-guide/widgets-specifics/switchers/)
    - [Plots](user-guide/widgets-specifics/plots/)
    - [Maths](user-guide/widgets-specifics/maths/)
