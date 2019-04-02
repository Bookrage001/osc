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
                        <div class="popup-title ${this.closable? 'closable' : ''}">
                            <span class="title">
                                ${options.icon ? raw(module.exports.icon(options.icon)) : ''}
                                ${this.title}
                            </span>
                            ${this.closable? html`<span class="closer">${raw(module.exports.icon('times'))}</span>` : ''}
                            </div>
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
    remoteBrowse: function(options, callback) {

        var save = options.save,
            saveInputFocus = undefined

        var popup = new module.exports.Popup({
            closable: true,
            title: locales(save ? 'remotesave_save' : 'remotesave_open'),
            hide: true
        })

        var container = DOM.get(popup.html, '.popup-content')[0],
            browser = html`<div class="file-browser"></div>`,
            ariane = html`<div class="ariane"></div>`,
            list = html`<form class="file-list"></form>`,
            saveInput = html`<input type="text" class="save-as"/>`,
            actions = html`
                <div class="file-actions">
                    ${ save ? saveInput : '' }
                    <div class="btn cancel">${raw(module.exports.icon('times'))} Cancel</div>
                    ${
                        save ?
                            html`<div class="btn submit save">${raw(module.exports.icon('save'))} Save</div>` :
                            html`<div class="btn submit open">${raw(module.exports.icon('folder-open'))} Open</div>`
                    }
                </div>
            `

        var files = [],
            path = ''

        var extRe = options.extension ? new RegExp('.*\\.' + options.extension + '$') : /.*/

        if (save) {
            saveInput.addEventListener('change', ()=>{
                if (!saveInput.value.match(extRe)) saveInput.value += '.' + options.extension
            })
            saveInput.addEventListener('focus', ()=>{
                saveInputFocus = true
            })
            list.addEventListener('change', ()=>{
                saveInputFocus = false
                var choice = DOM.get(list, ':checked')[0]
                if (choice && choice.classList.contains('file')) {
                    saveInput.value = choice.value
                }
            })
        }

        doubleTap(list, submit, {click: true})

        function submit(){

            var choice = DOM.get(list, ':checked')[0]

            if (!choice && (!save || !saveInput.value)) return

            if (choice && choice.classList.contains('folder') && (!save || !saveInputFocus)) {
                ipc.send('listDir', {path: [path, choice.value]})
            } else {
                if (save) {
                    if (files.some(x=>x.name===saveInput.value)) {
                        if (!confirm(locales('remotesave_overwrite'))) return
                    }
                    callback([path, saveInput.value])
                    popup.close()
                } else {
                    callback([path, choice.value])
                    popup.close()
                }
            }

        }

        actions.addEventListener('click', (e)=>{
            if (e.target.classList.contains('submit')) {
                submit()
            } else if ((e.target.classList.contains('cancel'))){
                popup.close()
            }
        })

        function keyDownHandler(e){

            if (e.target === saveInput) {
                return
            } else if (e.keyCode === 8) {
                list.childNodes[0].firstElementChild.checked = true
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
        function keyUpHandler(e){

            if (e.keyCode === 13) {
                setTimeout(submit, 100)
            }

        }

        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)


        ipc.on('listDir', (data)=>{

            ariane.textContent = path = data.path

            files = data.files.filter(x=>x.folder || x.name.match(extRe))


            function alphaSort(a, b){
                // convert to strings and force lowercase
                a = typeof a.name === 'string' ? a.name.toLowerCase() : a.name.toString()
                b = typeof b.name === 'string' ? b.name.toLowerCase() : b.name.toString()
                return a.localeCompare(b)
            }

            var fo = files.filter(x=>x.folder),
                fi = files.filter(x=>!x.folder)

            fo.sort(alphaSort)
            fi.sort(alphaSort)

            files = fo.concat(fi)

            files.unshift({
                name: '..',
                folder: true
            })


            browser.removeChild(list)
            list.innerHTML = ''
            for (let i in files) {
                var file = files[i]
                list.appendChild(html`
                    <div class="file">
                        <input type="radio" value="${file.name}" name="file" class="${file.folder ? 'folder' : 'file'}"/>
                        <div class="label"><span>${raw(module.exports.icon(file.folder ? 'folder' : 'osc'))} ${file.name}</span></div>
                    </div>
                `)
            }


            browser.insertBefore(list, actions)


            if (save && saveInputFocus === undefined) {
                saveInput.focus()
            } else {
                list.childNodes[0].firstElementChild.focus()
            }

        }, {context: popup})

        popup.on('close', ()=>{
            ipc.off('listDir', null, popup)
            document.removeEventListener('keydown', keyDownHandler)
            document.removeEventListener('keyup', keyUpHandler)
        })

        browser.appendChild(ariane)
        browser.appendChild(list)
        browser.appendChild(actions)
        container.appendChild(browser)

        ipc.send('listDir', {path: options.directory ? [options.directory] : null})

        popup.open()

    }

}
