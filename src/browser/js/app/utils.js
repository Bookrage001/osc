module.exports = {

    createPopup: function(title,content,closable) {

        var popup = $(`
            <div class="popup">
                <div class="popup-wrapper">
                <div class="popup-title ${closable? 'closable' : ''}">${title}${closable? `<span class="closer">${module.exports.icon('times')}</span>` : ''}</div>
                <div class="popup-content"></div>
                </div>
            </div>`),
            closer = popup.find('.popup-title .closer')

        if (closable) {
            closer.click(function(){
                popup.close()
            })
            $(document).on('keydown.popup', function(e){
                if (e.keyCode==27) popup.close()
            })
        }

        popup.close = function(){
            $(document).off('.popup')
            popup.remove()
        }

        popup.find('.popup-content').append(content)
        $('body').append(popup)

        return popup
    },
    loading: function(title){
        return module.exports.createPopup(title,'<p><div class="spinner"></div></p>', false)
    },
    icon: function(i) {
        return `<i class="fa fa-fw fa-${i}"></i>`
    },
    iconify:function(string){
        return String(string).replace(/\^[^\s]*/g,(x)=>{return module.exports.icon(x.substring(1))})
    }

}
