class ContextMenu {

    constructor(){

        this.menu = null
        this.event = 'fast-click'
        this.root = 'body'

    }

    open(e, actions, parent) {

        var menu = $('<div class="context-menu"></div>')

        for (let label in actions) {

            if (typeof actions[label] == 'object') {

                var item = $(`<div class="item has-sub" tabIndex="1">${label}</div>`)
                            .appendTo(menu)
                            .on(this.event, function(e){e.stopPropagation()})

                this.open(e,actions[label],item)


            } else {

                $(`<div class="item">${label}</div>`).on(this.event,()=>{
                    actions[label]()
                    this.close()
                }).appendTo(menu)
            }

        }

        if (parent) menu.appendTo(parent)

        if (!parent) {

            this.menu = menu

            menu.appendTo(this.root)

            menu.find('.item').hover(function(){
                $(this).siblings().removeClass('focus').find('.focus').removeClass('focus')
                $(this).addClass('focus')
            }, function(){
                if (!$(this).hasClass('has-sub')) $(this).removeClass('focus')
            })

            menu.css({
                top: e.pageY + 'px',
                left: e.pageX + 'px'
            })

            this.correctPosition(menu)

            menu.find('.context-menu').each((i, m)=>{
                this.correctPosition($(m), $(m).parent())
            })

        }


    }

    close() {

        if (this.menu) {

            this.menu.remove()
            this.menu = null

        }

    }

    correctPosition(menu, parent) {

        var pos = menu.offset(),
            width = menu.outerWidth(),
            height = menu.outerHeight(),
            totalWidth = $(this.root).outerWidth(),
            totalHeight = $(this.root).outerHeight(),
            leftAdjust = !parent ? 0 : parent.outerWidth() - 2

        if (width + pos.left > totalWidth) {
            menu.css({'margin-left': totalWidth - (width + pos.left + leftAdjust)})
        }
        if (height + pos.top > totalHeight) {
            menu.css({'margin-top': totalHeight - (height + pos.top)})
        }

    }

}


module.exports = ContextMenu
