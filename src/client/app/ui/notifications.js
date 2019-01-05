var html = require('nanohtml')

var DURATION = 3500

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
                match[0].date = Date.now()
                return
            }
        }

        var toast = html`
            <div class="toast ${data.class || ''}">
                <i class="fa fa-fw fa-${data.icon || (data.class === 'error' ? 'exclamation' : 'bell')}"></i>
                <div class="content">
                    ${data.message}
                </div>
            </div>
        `
        toast.date = Date.now()
        if (data.id) toast.id = data.id
        this.container.appendChild(toast)
        toast.style.height = toast.offsetHeight + 'px'
        this.toasts.push(toast)

        this.startLoop()

    }

    remove(toast) {

        this.toasts.splice(this.toasts.indexOf(toast), 1)
        toast.classList.add('remove')
        toast.classList.add('remove')
        setTimeout(()=>{
            this.container.removeChild(toast)
        }, 200)

        if (this.toasts.length === 0) this.stopLoop()

    }

    startLoop() {

        if (this.loop) return

        this.loop = setInterval(()=>{
            for (var i = this.toasts.length - 1; i > -1; i--) {
                if (Date.now() - this.toasts[i].date > DURATION) {
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
