var popupSingleton = null,
    uploadSingleton = null,
    locales = require('../locales'),
    html = require('nanohtml'),
    raw = require('nanohtml/raw'),
    ipc = require('../ipc'),
    EventEmitter = require('../events/event-emitter'),
    doubleTap = require('../widgets/mixins/double_tap')

module.exports = {

    Popup: class Popup extends EventEmitter {

        constructor(options) {

            super()

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

            if (!options.hide) this.open()


        }



        close() {

            if (!this.state) return
            this.state = 0

            if (this.escKey) document.removeEventListener('keydown', this.escKeyHandler)
            if (this.enterKey) document.removeEventListener('keydown', this.enterKeyHandler)
            document.body.removeChild(this.html)

            this.trigger('close')

        }

        open() {

            if (this.state) return
            this.state = 1

            if (this.escKey) document.addEventListener('keydown', this.escKeyHandler)
            if (this.enterKey) document.addEventListener('keydown', this.enterKeyHandler)
            document.body.appendChild(this.html)

            this.trigger('open')
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

    },
    remoteBrowse: function(ext='json', callback) {

        var popup = new module.exports.Popup({
            closable: true,
            title: `Open file`,
            hide: true
        })

        var container = DOM.get(popup.html, '.popup-content')[0],
            browser = html`<div class="file-browser"></div>`,
            ariane = html`<div class="ariane"></div>`,
            list = html`<form class="file-list"></form>`,
            actions = html`
                <div class="file-actions">
                    <div class="btn cancel">${raw(module.exports.icon('times'))} Cancel</div>
                    <div class="btn open">${raw(module.exports.icon('folder-open'))} Open</div>
                </div>
            `

        var files = [],
            path = ''


        doubleTap(list, submit)

        function submit(){

            var choice = DOM.get(list, ':checked')[0]

            if (!choice) return

            if (choice.classList.contains('folder')) {
                ipc.send('listDir', {path: [path, choice.value]})
            } else {
                callback([path, choice.value])
                popup.close()
            }

        }

        actions.addEventListener('click', (e)=>{
            if (e.target.classList.contains('open')) {
                submit()
            } else {
                popup.close()
            }
        })

        function keyHandler(e){
            if (e.keyCode === 13) {
                submit()
            } else if (e.keyCode === 8) {
                list.childNodes[0].firstElementChild.click()
                submit()
            } else if (e.key.length === 1) {
                var letter = e.key.toLowerCase()
                for (let i in files) {
                    if (files[i].name[0].toLowerCase() === letter && !list.childNodes[i].firstElementChild.checked) {
                        list.childNodes[i].firstElementChild.click()
                        list.childNodes[i].firstElementChild.focus()
                        break
                    }
                }
            }
        }

        document.addEventListener('keydown', keyHandler)


        ipc.on('listDir', (data)=>{

            ariane.innerHTML = path = data.path

            if (ext) {
                if (!Array.isArray(ext)) ext = [ext]
                var filter = new RegExp('.*\\.(' + ext.join('|') + ')')
                files = data.files.filter(x=>x.folder || x.name.match(filter))
            }

            files.sort(function(a, b) {
                // convert to strings and force lowercase
                a = typeof a.name === 'string' ? a.name.toLowerCase() : a.name.toString();
                b = typeof b.name === 'string' ? b.name.toLowerCase() : b.name.toString();
                return a.localeCompare(b);
            })

            files.unshift({
                name: '..',
                folder: true
            })

            list.innerHTML = ''
            for (let i in files) {
                var file = files[i]
                list.appendChild(html`
                    <div class="file">
                        <input type="radio" value="${file.name}" name="file" class="${file.folder ? 'folder' : ''}"/>
                        <div class="label"><span>${raw(module.exports.icon(file.folder ? 'folder' : 'file-alt'))} ${file.name}</span></div>
                    </div>
                `)
            }


            container.innerHTML = ''
            browser.appendChild(ariane)
            browser.appendChild(list)
            browser.appendChild(actions)
            container.appendChild(browser)

            popup.open()

            list.childNodes[0].firstElementChild.focus()

        }, {context: popup})

        popup.on('close', ()=>{
            ipc.off('listDir', null, popup)
            document.removeEventListener('keydown', keyHandler)
        })

        ipc.send('listDir', {})

    }

}
