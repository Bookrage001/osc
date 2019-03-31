var html = require('nanohtml'),
    raw = require('nanohtml/raw'),
    locales = require('../locales')

class ContextMenu {

    constructor(){

        this.menu = null
        this.root = document.body
        this.clickHandler = (e)=>{
            if (this.menu && !this.menu.contains(event.target)) this.close()
        }

    }

    open(e, actions, parent) {

        var menu = html`<div class="context-menu"></div>`

        for (let action of actions) {

            if (Array.isArray(action.action)) {

                let item = html`<div class="item has-sub" tabIndex="1">${raw(action.label)}</div>`

                menu.appendChild(item)

                this.open(e, action.action, item)


            } else {

                let item = html`<div class="item">${raw(action.label)}</div>`

                menu.appendChild(item)

                if (action.click) {

                    item.addEventListener('click', (e)=>{
                        e.preventDefault()
                        action.action()
                        this.close()
                    })

                } else {

                    item.addEventListener('fast-click', (e)=>{
                        e.detail.preventOriginalEvent = true
                        action.action()
                        this.close()
                    })

                }

            }

        }

        if (parent) parent.appendChild(menu)

        if (!parent) {

            this.menu = menu

            this.root.appendChild(menu)

            DOM.each(menu, '.item', (item)=>{
                item.addEventListener('mouseenter', ()=>{
                    DOM.each(item.parentNode, '.focus', (focused)=>{
                        focused.classList.remove('focus')
                    })
                    item.classList.add('focus')
                })
                item.addEventListener('mouseleave', ()=>{
                    if (!item.classList.contains('has-sub')) item.classList.remove('focus')
                })
            })

            menu.style.top = e.pageY + 'px'
            menu.style.left = e.pageX + 'px'

            this.correctPosition(menu)

            DOM.each(menu, '.context-menu', (m)=>{
                this.correctPosition(m, m.parentNode)
            })

        }

        document.addEventListener('fast-click', this.clickHandler, true)
        document.addEventListener('fast-right-click', this.clickHandler, true)

    }

    close() {

        if (this.menu) {

            this.menu.parentNode.removeChild(this.menu)
            this.menu = null

        }

        document.removeEventListener('fast-click', this.clickHandler, true)
        document.removeEventListener('fast-right-click', this.clickHandler, true)
    }

    correctPosition(menu, parent) {

        var position = DOM.offset(menu),
            width = menu.offsetWidth,
            height = menu.offsetHeight,
            totalWidth = this.root.offsetWidth,
            totalHeight = this.root.offsetHeight

        if (width + position.left > totalWidth) {
            menu.style.right = parent ? '100%' : '0'
            menu.style.left = 'auto'
            menu.style.marginRight = '2rem'
        }

        if (height + position.top > totalHeight) {
            menu.style.top = 'auto'
            menu.style.bottom = '2rem'
        }

    }

}

module.exports = new ContextMenu()
