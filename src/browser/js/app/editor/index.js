var init = require('./init')

var Editor = class Editor {

    constructor() {

    }

    enable() {

        GRIDWIDTH =  getComputedStyle(document.documentElement).getPropertyValue("--grid-width")

        $('.editor-root').attr('data-widget', $('.root-container').attr('data-widget')).removeClass('disabled')
        $('.enable-editor').addClass('on')
        $('.disable-editor').removeClass('on')
        $('body').addClass('editor-enabled')
                 .toggleClass('no-grid', GRIDWIDTH==1)

        EDITING = true

        var f = $('<div class="form" id="grid-width-input"></div>'),
            h = $('<div class="separator"><span>Grid</span></div>').appendTo(f),
            w = $('<div class="input-wrapper"><label>Width</label></div>').appendTo(f),
            i = $('<input class="input" type="number" step="1" min="1" max="100"></div>').appendTo(w)

        i.val(GRIDWIDTH)
        i.on('keyup mouseup change mousewheel',()=>{
            setTimeout(()=>{
                var v = Math.max(Math.min(parseInt(i.val()),100),1)
                if (isNaN(v)) return
                i.val(v)
                GRIDWIDTH = v
                $('body').toggleClass('no-grid', GRIDWIDTH==1)
                document.documentElement.style.setProperty("--grid-width",GRIDWIDTH)
            })
        })
        $('.editor-menu').append(f)

    }

    disable() {

        $('.widget.ui-resizable').resizable('destroy')
        $('.widget.ui-draggable').draggable('destroy').find('.ui-draggable-handle').remove()
        $('.editing').removeClass('editing')
        $('.editor-root').addClass('disabled')
        $('.editor-container').remove()
        $('.disable-editor').addClass('on')
        $('.enable-editor').removeClass('on')
        $('body').removeClass('editor-enabled')
        $('#grid-width-input').remove()

        EDITING = false

        if (READ_ONLY) {
            this.enable = ()=>{}
            $('.editor-menu .btn').remove()
            $('.editor-menu .title').html($('.editor-menu .title').html() + ' (disabled)').addClass('disabled')
        }

    }

}

var editor = new Editor()

module.exports = editor
