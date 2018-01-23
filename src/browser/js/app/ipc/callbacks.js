var utils = require('../ui/utils'),
    osc = require('../osc'),
    session = require('../managers/session'),
    widgetManager = require('../managers/widgets'),
    state = require('../managers/state'),
    editor = require('../editor/')

var callbacks = module.exports = {

    bundle: function(data) {
        for (let i in data) {
            osc.receive(data[i])
        }
    },

    receiveOsc: function(data){
        osc.receive(data)
    },

    connected:function(){
        LOADING.close()
    },

    sessionList: function(data){

        session.list(data)

    },

    sessionOpen: function(data){

        session.open(data)

    },

    sessionNew: function(){

        session.create()

    },

    stateSend:function(){
        var p = utils.loading('New client connecting...')

        setTimeout(function(){

            osc.syncOnly = true
            state.send()
            osc.syncOnly = false

            p.close()
        },150)

    },

    editorDisable: function(data){

        editor.disable(data.permanent)

    },

    error: function(data){
       new utils.Popup({title: utils.icon('exclamation-triangle') + '&nbsp;Error', content: data, closable:true})
    },

    reloadCss: function(){
        var queryString = '?reload=' + new Date().getTime()
        DOM.each(document, 'link[rel="stylesheet"][hot-reload]', (el)=>{
            el.href = el.href.replace(/\?.*|$/, queryString)
        })

        setTimeout(()=>{
            var root = widgetManager.getWidgetById('root')[0]
            if (root) root.reCreateWidget()
        },100)

        GRIDWIDTH =  getComputedStyle(document.documentElement).getPropertyValue("--grid-width")
    },

    readOnly: function(){
        READ_ONLY = true
    }

}
