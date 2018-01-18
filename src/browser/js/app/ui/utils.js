var Popup = require('./popup')

module.exports = {

    loading: function(title){
        return new Popup({
            title: title,
            content: '<p><div class="spinner"></div></p>',
            closable: false
        })
    },
    icon: function(i) {
        return `<i class="fa fa-fw fa-${i}"></i>`
    },
    iconify:function(string){
        return String(string).replace(/\^[^\s]*/g,(x)=>{return module.exports.icon(x.substring(1))})
    }

}
