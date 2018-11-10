var screenfull = require('screenfull'),
    {Popup} = require('./utils'),
    locales = require('../locales')

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


module.exports = fullscreen
