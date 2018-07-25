const packager = require('electron-packager'),
      path = require('path'),
      appData = require('../app/package.json'),
      safeFFMPEG = require('electron-packager-plugin-non-proprietary-codecs-ffmpeg').default

var rpi = process.argv.includes('--rpi')

packager({
    dir: path.resolve(__dirname + '/../app'),
    name: appData.name,
    platform: rpi ? 'linux' : process.env.PLATFORM,
    arch: rpi ? 'armv7l' : process.env.ARCH,
    electronVersion:  rpi ? '1.7.11' : undefined,
    overwrite: true,
    out: path.resolve(__dirname + '/../dist'),
    icon: path.resolve(__dirname + '/../resources/images/logo'),
    ignore: /node_modules\/(serialport|uws)/,
    afterExtract: [safeFFMPEG],
    prune: false
}).then(()=>{})
