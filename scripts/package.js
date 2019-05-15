const packager = require('electron-packager'),
      path = require('path'),
      appData = require('../app/package.json'),
      safeFFMPEG = require('electron-packager-plugin-non-proprietary-codecs-ffmpeg').default

var all = process.argv.includes('--all'),
    ia32= process.argv.includes('--ia32')

packager({
    dir: path.resolve(__dirname + '/../app'),
    name: appData.name,
    all: all ? true : undefined,
    platform: ia32 ? 'linux' : process.env.PLATFORM,
    arch: ia32 ? 'ia32' : process.env.ARCH,
    electronVersion:  ia32 ? '1.8.8' : electronVersion,
    overwrite: true,
    out: path.resolve(__dirname + '/../dist'),
    icon: path.resolve(__dirname + '/../resources/images/logo'),
    ignore: /node_modules\/(serialport|uws)/,
    afterExtract: [safeFFMPEG],
    prune: false
}).then(()=>{

    console.warn('\x1b[36m%s\x1b[0m', '=> Build artifacts created in ' + path.resolve(__dirname + '/../dist'))

})
