const packager = require('electron-packager'),
      path = require('path'),
      appData = require('../app/package.json'),
      safeFFMPEG = require('electron-packager-plugin-non-proprietary-codecs-ffmpeg').default

packager({
    dir: path.resolve(__dirname + '/../app'),
    name: appData.name,
    platform: process.env.PLATFORM,
    arch: process.env.ARCH,
    overwrite: true,
    out: path.resolve(__dirname + '/../dist'),
    icon: path.resolve(__dirname + '/../resources/images/logo'),
    ignore: /node_modules\/(serialport|uws)/,
    afterExtract: [safeFFMPEG],
    prune: false
}, ()=>{})
