var popupSingleton = null,
    uploadSingleton = null,
    locales = require('../locales'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw')

module.exports = {

    Popup: class Popup {

        constructor(options) {

            if (options.closable) {

                if (popupSingleton) {
                    popupSingleton.close()
                    popupSingleton = null
                }

                popupSingleton = this

            }

            this.closable = options.closable
            this.escKey = options.closable || options.escKey
            this.enterKey = options.enterKey
            this.content = options.content
            this.title = options.title
            this.state = 0

            this.html = html`
                <div class="popup show">
                    <div class="popup-wrapper">
                        <div class="popup-title ${this.closable? 'closable' : ''}">${this.title}${this.closable? html`<span class="closer">${raw(module.exports.icon('times'))}</span>` : ''}</div>
                        <div class="popup-content">
                            ${this.content}
                        </div>
                    </div>
                </div>
            `

            if (this.closable) {
                var closer = DOM.get(this.html, '.popup-title .closer')[0]
                this.html.addEventListener('fast-click',(e)=>{
                    if (e.target === this.html || e.target === closer) {
                        e.detail.preventOriginalEvent = true
                        this.close()
                    }
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
            if (!this.state) return
            this.state = 0

            if (this.escKey) document.removeEventListener('keydown', this.escKeyHandler)
            if (this.enterKey) document.removeEventListener('keydown', this.enterKeyHandler)
            document.body.removeChild(this.html)
        }

        open() {
            if (this.state) return
            this.state = 1

            if (this.escKey) document.addEventListener('keydown', this.escKeyHandler)
            if (this.enterKey) document.addEventListener('keydown', this.enterKeyHandler)
            document.body.appendChild(this.html)
        }
    },

    loading: function(title){
        return new module.exports.Popup({
            title: title,
            content: html`<p><div class="spinner"></div></p>`,
            closable: false
        })
    },
    icon: function(i) {
        return `<i class="fa fa-fw fa-${i}"></i>`
    },
    iconify:function(string){
        return String(string).replace(/\^[^\s]*/g,(x)=>{return module.exports.icon(x.substring(1))})
    },
    upload: function(types, ok, error) {

        if (uploadSingleton) document.body.removeChild(uploadSingleton)

        uploadSingleton = html`<input type="file" accept="${types}" style="position:absolute;opacity:0;pointer-events:none;"/>`
        document.body.appendChild(uploadSingleton)

        uploadSingleton.addEventListener('change',function(e){


            var reader = new FileReader(),
                file = e.target.files[0],
                loader = module.exports.loading(locales('loading_upload'))

            reader.onerror = reader.onabort = function() {
                loader.close()
                error()
            }

            reader.onload = function(e) {
                loader.close()
                ok(file.path, e.target.result)
            }

            reader.readAsText(file, 'utf-8')

        })

        uploadSingleton.click()

    }

}
