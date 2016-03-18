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
$ npm install --save-opional
$ export PLATFORM=TARGET_PLATFORM # TARGET_PLATFORM can be linux, win32 (windows) or darwin (os x)
$ export ARCH=TARGET_ARCH         # TARGET_ARCH can be ia32 or x64
$ npm run build

$ # Do the following if you want a deb package for debian/ubuntu
$ npm run deb32
$ # or
$ npm run deb64
```

This will build the app in `dist/open-stage-control-PLATFORM-ARCH`.

*Please note that building the app for windows from a linux system requires wine to be installed.*
