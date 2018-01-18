class Lobby {

    constructor() {

        this.state = 0

    }

    create() {
        
        this.html = DOM.create(`
            <div id="lobby">
                <div class="main">
                    <div class="header">
                        ${PACKAGE.productName}
                    </div>
                    <div class="list"></div>
                    <div class="footer"></div>
                </div>
            </div>
        `)

        this.main = DOM.get(this.html, '.main')[0]
        this.list = DOM.get(this.html, '.list')[0]
        this.footer = DOM.get(this.html, '.footer')[0]

    }

    open() {
        if (this.state) return
        this.state = 1
        document.body.appendChild(this.html)
        setTimeout(()=>{
            this.main.classList.add('show')
        })
    }

    close() {
        if (!this.state) return
        this.state = 0
        this.main.classList.remove('show')
        document.body.removeChild(this.html)
    }

}

var lobby = new Lobby()

module.exports = lobby
