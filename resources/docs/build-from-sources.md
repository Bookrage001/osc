## Build from sources

**Requirements**
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

```
$ sudo apt-get install npm  # install nodejs & npm
$ sudo npm install -g npm   # update npm
```

**Build**
 ```
$ git clone https://github.com/jean-emmanuel/open-stage-control
$ cd open-stage-control
$ npm install --save-dev
$ export PLATFORM=TARGET_PLATFORM # TARGET_PLATFORM can be linux, win32 (windows) or darwin (os x)
$ export ARCH=TARGET_ARCH         # TARGET_ARCH can be ia32 or x64
$ npm run build

$ # Do the following if you want a deb package for debian/ubuntu
$ npm run deb32
$ # or
$ npm run deb64
```

This will build the app in `dist/open-stage-control-PLATFORM-ARCH`.
