var fs = require('fs'),
    path = require('path'),
    settings = require('./settings')

class Theme {

    constructor() {

        this.themes = []
        this.files = []
        this.css = []

        this.defaultColor = '#191f2a'
        this.backgroundColor = this.defaultColor

    }

    init() {

        this.themes = settings.read('theme')
        this.files = []

        for (let theme of this.themes) {

            if (theme.includes('.css') && fs.existsSync(theme)) {
                this.files.push(theme)
            } else if (!theme.includes('.css') && fs.existsSync(path.resolve(__dirname + '/../browser/themes/' + theme + '.css'))) {
                this.files.push(path.resolve(__dirname + '/../browser/themes/' + theme + '.css'))
            } else {
                console.error('Theme error: "' + themes + '" not found.')
            }
        }

        this.load()

        return this

    }

    load() {

        this.css = []

        for (let i in this.files) {

            try {
                this.css.push(fs.readFileSync(this.files[i],'utf-8'))
            } catch(err) {
                console.error('Theme error: could not load "' + this.files[i] + '".')
            }

        }

        var css = this.get()

        if (css.includes('--color-bg:')) {
            this.backgroundColor = css.match(/--color-bg:([^;]*);/)[1].trim()
        } else {
            this.backgroundColor = this.defaultColor
        }

        return this

    }

    get() {

        return this.css.join('\n')

    }

}

var theme = new Theme()

module.exports = theme
