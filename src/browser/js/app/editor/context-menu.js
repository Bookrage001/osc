var correctPosition = function (m, parent){
    var pos = m.offset(),
        width = m.outerWidth(),
        height = m.outerHeight(),
        totalWidth = $('body').outerWidth(),
        totalHeight = $('body').outerHeight(),
        leftAdjust = parent=='body'?0:parent.outerWidth()-2

    if (width + pos.left > totalWidth) {
        m.css({'margin-left':totalWidth-(width + pos.left + leftAdjust)})
    }
    if (height + pos.top > totalHeight) {
        m.css({'margin-top':totalHeight-(height + pos.top)})
    }
}

var ev = 'fake-click'


var menu = function(e,actions,parent){

    var m = $('<div class="context-menu"></div>')
    if (parent=='body') {
        m.css({top:e.pageY+'px',left:e.pageX+'px'})
    }

    for (label in actions) {

        if (typeof actions[label] == 'object') {

            var item = $(`<div class="item has-sub" tabIndex="1">${label}</div>`).appendTo(m).on(ev,function(e){e.stopPropagation()})
            menu(e,actions[label],item)


        } else {

            $(`<div class="item">${label}</div>`).on(ev + '.editor',function(){
                var callback = actions[label]
                return function(e){
                    callback()
                    $('.context-menu').remove()
                }
            }()).appendTo(m)
        }
    }

    m.appendTo(parent)



    if (parent=='body') {
        correctPosition(m,parent)
    } else {
        parent.hover(function(){correctPosition(m,parent)})
    }

}

module.exports = menu
