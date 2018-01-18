var {icon} = require('./utils')

module.exports = class Popup {

    constructor(options) {

        this.closable = options.closable
        this.escKey = options.closable || options.escKey
        this.enterKey = options.enterKey
        this.content = options.content
        this.title = options.title

        this.html = DOM.create(`
            <div class="popup show">
                <div class="popup-wrapper">
                    <div class="popup-title ${this.closable? 'closable' : ''}">${this.title}${this.closable? `<span class="closer">${module.exports.icon('times')}</span>` : ''}</div>
                    <div class="popup-content">
                        ${this.content}
                    </div>
                </div>
            </div>
        `)

        if (this.closable) {
            DOM.get(this.html, '.popup-title .closer')[0].addEventListener('fake-click', ()=>{
                this.close()
            })
        }

        if (this.escKey) {
            this.escKeyHandler = ((e)=>{
                if (e.keyCode==27) this.close()
            }).bind(this)
        }

        if (this.enterKey) {
            this.enterKeyHandler = ((e)=>{
                if (e.keyCode == 13) this.enterKey.call(this, e)
            }).bind(this)
        }

        this.open()


    }



    close() {
        if (this.escKey) document.removeEventListener('keydown', this.escKeyHandler)
        if (this.enterKey) document.removeEventListener('keydown', this.enterKeyHandler)
        document.body.removeChild(this.html)
    }

    open() {
        if (this.escKey) document.addEventListener('keydown', this.escKeyHandler)
        if (this.enterKey) document.addEventListener('keydown', this.enterKeyHandler)
        document.body.appendChild(this.html)
    }
}
