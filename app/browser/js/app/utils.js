module.exports = {

    createPopup: function(title,content) {

        var popup = $(`
            <div class="popup">
                <div class="popup-wrapper">
                <div class="popup-title">${title}<span class="closer">${module.exports.icon('remove')}</span></div>
                <div class="popup-content"></div>
                </div>
            </div>`),
            closer = popup.find('.popup-title .closer')

        closer.click(function(){
            popup.close()
        })


        popup.close = function(){
            $(document).off('.popup')
            popup.remove()
        }

        popup.find('.popup-content').append(content)
        $('body').append(popup)

        $(document).on('keydown.popup', function(e){
            if (e.keyCode==27) popup.close()
        })



        return popup
    },
    icon: function(i) {
        return `<i class="fa fa-fw fa-${i}"></i>`
    }

}
