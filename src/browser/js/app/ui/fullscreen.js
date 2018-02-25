var screenfull = require('screenfull'),
    {Popup} = require('./utils')

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
                title: 'Fullscreen not available',
                content: 'You must add this page to your home screen to launch it in fullscreen',
                closable: true
            })

        }

        on(){}

    }

    fullscreen = new IOSFullScreen()

}

module.exports = fullscreen
