var screenfull = require('screenfull'),
    {Popup} = require('./utils'),
    locales = require('../locales'),
    NoSleep = require('nosleep.js')

var fullscreen

if (screenfull.enabled) {

    fullscreen = screenfull

} else {

    class IOSFullScreen {

        constructor(){

            this.enabled = !navigator.standalone
            this.isFullScreen = navigator.standalone

        }

        toggle(){

            new Popup({
                title: locales('fs_unnavailable'),
                content: locales('fs_addtohome'),
                closable: true
            })

        }

        on(){}

    }

    fullscreen = new IOSFullScreen()

}


fullscreen.on('change', () => {
    var noSleep = new NoSleep()

    if(screenfull.isFullscreen){
      noSleep.enable()
    }
    else{
      noSleep.disable()
    }
})

module.exports = fullscreen
