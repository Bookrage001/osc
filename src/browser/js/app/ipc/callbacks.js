var utils = require('../utils'),
    icon = utils.icon,
    osc = require('../osc'),
    session = require('../managers/session'),
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

        session.new()

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
       utils.createPopup(icon('warning') + '&nbsp;Error', data, true)
    },

    reloadCss: function(){
        var queryString = '?reload=' + new Date().getTime()
        $('link[rel="stylesheet"][hot-reload]').each(function () {
            this.href = this.href.replace(/\?.*|$/, queryString)
        })
        setTimeout(()=>{
            $('canvas').trigger('resize',[0,0,true])
        },100)

        GRIDWIDTH =  getComputedStyle(document.documentElement).getPropertyValue("--grid-width")
    },

    readOnly: function(){
        READ_ONLY = true
    }

}
