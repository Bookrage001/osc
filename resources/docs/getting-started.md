# Getting started

----
## Run from binaries


Prebuilt binaries for Linux, Windows and OS X can be found on the [release](https://github.com/jean-emmanuel/open-stage-control/releases) page.


Here are the available command-line switches. Note that when running without command-line switch, a launcher window will be spawn to help setting them. 

```
Options:
  -s, --sync      synchronized hosts (ip:port pairs) (osc messages sent by widgets will also be sent to these targets)
  -l, --load      session file to load
  -c, --custom-module  custom module file to load
  -p, --port      http port of the server (default to 8080)
  -o, --osc-port  osc input port
  -d, --debug     log received osc messages in the console
  -n, --no-gui    disable default gui
  -g, --gui-only  app server's url. If true, local port (--port) is used
  -t, --theme     theme name or path (mutliple values allowed)   
  -e, --examples  list examples instead of recent sessions
  -h, --help      display help
  -v, --version   display version number


Examples:

$ open-stage-control -s 127.0.0.1:5555 127.0.0.1:6666 -p 7777

This will create an app listening on port 7777 for synchronization messages, and sending its widgets state changes to ports 5555 and 6666.

$ open-stage-control -n -l path/to/session.js

This will create a headless app available through http on port 8080. Multiple clients can use the app (with chrome only) simultaneously, their widgets will be synchronized.

$ open-stage-control -n -l path/to/session.js



$ open-stage-control -t light noinput /path/to/custom_theme.css

This will apply three themes (light ui, remove all inputs, and a custom theme file)


Available themes:
- light
- noinput
```

----
## Run from sources

Running the app from the sources slightly differs from using built binaries : instead of running a binary, we'll launch the app with npm.

**Requirements**

- [Node.js >= 4.0](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

```bash
$ sudo apt-get install nodejs npm  # install nodejs & npm
$ sudo npm install -g npm   # update npm
```


**Download**

```bash
$ git clone https://github.com/jean-emmanuel/open-stage-control
$ cd open-stage-control/
$ npm install
 ```

**Run**

```bash
$ npm start [ -- options]

# A double hyphen ("--") is used here to tell npm that the following options are to be given to the app.
```

----
## Build from sources

**Requirements**

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

```bash
$ sudo apt-get install npm  # install nodejs & npm
$ sudo npm install -g npm   # update npm
```

**Build**

```bash
$ git clone https://github.com/jean-emmanuel/open-stage-control
$ cd open-stage-control
$ npm install
$ export PLATFORM=TARGET_PLATFORM # TARGET_PLATFORM can be linux, win32 (windows) or darwin (os x)
$ export ARCH=TARGET_ARCH         # TARGET_ARCH can be ia32, x64 or armv7l
$ npm run build

$ # Do the following if you want a deb package for debian/ubuntu
$ npm run deb32
$ # or
$ npm run deb64
$ # or
$ npm run debarm
```

This will build the app in `dist/open-stage-control-PLATFORM-ARCH`.

*Please note that building the app for windows from a linux system requires wine to be installed.*
