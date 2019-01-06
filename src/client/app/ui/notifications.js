var html = require('nanohtml'),
    morph = require('nanomorph')


var DEFAULT_DURATION = 3500

class Toast {

    constructor(data) {

        this.id = data.id || Date.now()
        this.update(data)

    }

    update(data) {

        this.expires = Date.now() + (data.duration || DEFAULT_DURATION)

        var toast = html`
            <div class="toast ${data.class || ''}">
                <i class="fa fa-fw fa-${data.icon || (data.class === 'error' ? 'exclamation' : 'bell')}"></i>
                <div class="content">
                    ${data.message}
                </div>
            </div>
        `
        if (this.html) {
            this.html = morph(this.html, toast)
        } else {
            this.html = toast
        }

    }

    appendTo(el) {

        el.appendChild(this.html)
        this.html.style.height = this.html.offsetHeight + 'px'

    }

    removeFrom(el) {

        this.html.classList.add('remove')
        setTimeout(()=>{
            el.removeChild(this.html)
        }, 200)

    }

}

class Notifications {

    constructor() {

        this.container = DOM.get('#notifications')[0]
        this.toasts = []

        this.loop = null

    }

    add(data) {

        if (data.id) {
            var match = this.toasts.filter(x => x.id === data.id)
            if (match.length) {
                return match[0].update(data)
            }
        }

        var toast = new Toast(data)

        toast.appendTo(this.container)
        this.toasts.push(toast)

        this.startLoop()

    }

    remove(toast) {

        toast.removeFrom(this.container)
        this.toasts.splice(this.toasts.indexOf(toast), 1)

        if (this.toasts.length === 0) this.stopLoop()

    }

    startLoop() {

        if (this.loop) return

        this.loop = setInterval(()=>{
            for (var i = this.toasts.length - 1; i > -1; i--) {
                if (Date.now() > this.toasts[i].expires) {
                    this.remove(this.toasts[i])
                }
            }

        },100)

    }

    stopLoop() {

        if (!this.loop) return

        clearInterval(this.loop)
        this.loop = null

    }


}

module.exports = new Notifications()
