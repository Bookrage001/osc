class ContextMenu {

    constructor(){

        this.menu = null
        this.event = 'fast-click'
        this.root = document.body

    }

    open(e, actions, parent) {

        var menu = DOM.create('<div class="context-menu"></div>')

        for (let label in actions) {

            if (typeof actions[label] == 'object') {

                var item = DOM.create(`<div class="item has-sub" tabIndex="1">${label}</div>`)
                menu.appendChild(item)
                item.addEventListener(this.event, (e)=>{
                    e.stopPropagation()
                })

                this.open(e,actions[label],item)


            } else {

                var item = DOM.create(`<div class="item">${label}</div>`)
                menu.appendChild(item)
                item.addEventListener(this.event, (e)=>{
                    actions[label]()
                    this.close()
                })

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


    }

    close() {

        if (this.menu) {

            this.menu.parentNode.removeChild(this.menu)
            this.menu = null

        }

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


module.exports = ContextMenu
