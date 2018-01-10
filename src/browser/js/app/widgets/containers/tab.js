var Panel = require('./panel'),
    editClean = function(){editClean = require('../../editor/edit-objects').editClean; editClean(...arguments)}



module.exports = class Tab extends Panel {

    static defaults() {

        return {
            type:'tab',
            id:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _panel:'panel',

            layout:'',
            spacing:0,
            value:'',

            _osc:'osc',

            precision:0,
            address:'auto',
            preArgs:[],
            target:[],

            _children:'children',

            variables:'@{parent.variables}',

            widgets:[],
            tabs:[]
        }

    }

    constructor(options) {

        options.props.scroll = true

        super(options)

        this.widget.addClass('tab')

        this.detached = false

        var $body = $('body')

    }

    hide() {
        if (EDITING) editClean()
        this.widget.detach()
        this.container.hide()
        this.detached = true

    }
    show() {
        this.container.show().append(this.widget)
        this.detached = false
    }

}
