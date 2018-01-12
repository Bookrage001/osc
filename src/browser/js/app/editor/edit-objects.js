var updateWidget = require('./data-workers').updateWidget,
    {widgets, categories} = require('../widgets/'),
    {icon} = require('../utils'),
    defaults = {}

for (var k in widgets) {
    defaults[k] = widgets[k].defaults()
}

var ev = 'fake-click'

var editClean = function(){
    $('.editing').removeClass('editing')
    $('.widget.ui-resizable').resizable('destroy')
    $('.widget.ui-draggable').draggable('destroy').find('.ui-draggable-handle').remove()
    $('.editor-container').remove()
}


var editObject = function(widget, options = {}){

    var container = widget.container,
        data = widget.props

    if (!options.refresh && (container.hasClass('editing'))) return

    editClean()

    $(`[data-widget="${widget.hash}"]`).addClass('editing')

    $('#editor').append('<div class="editor-container"></div>')

    var form = $('<div class="form"></div>')

    var params = defaults[data.type]

    $(`<div class="separator"><span>${data.type == 'tab' ? 'Tab' : data.type == 'root' ? 'Root' : 'Widget'}</span></div>`).appendTo(form)

    for (var i in params) {

        if (i.indexOf('_')==0) {
            $(`<div class="separator"><span>${params[i]}</span></div>`).appendTo(form)
            continue
        } else if (data[i]===undefined) {
            continue
        }

        // Common options edit
        if (i!='widgets' && i!='tabs') {

            if (i=='type' && (data.type == 'tab' || data.type == 'root')) continue

            let type = typeof data[i],
                value = type != 'string'?JSON.stringify(data[i], null, '  ').replace(/\n\s\s\s\s/g, ' ').replace(/\n\s\s(\}|\])/g, ' $1'):data[i],
                wrapper = $('<div class="input-wrapper"></div>').appendTo(form),
                label = $(`<label>${i}</label>`).appendTo(wrapper),
                input

            if (i=='type') {

                input = $(`<select class="input" data-type="${type}" title="${i}"/>`)

                for (let c in categories) {
                    input.append(`<optgroup label="> ${c}">`)
                    for (let t of categories[c]) {
                        input.append(`<option ${t==value?'selected=':''} value="${t}">${t}</option>`)
                    }
                    input.append(`</optgroup>`)
                }
                let select = $('<div class="select-wrapper"></div>').append(input)
                select.appendTo(wrapper)

            } else {

                input = $(`<textarea class="input" data-type="${type}" title="${i}" rows="${value.split('\n').length}">${value}</textarea>`)
                input.on('input focus', function(){
                    this.setAttribute('rows',0)
                    this.setAttribute('rows',input.val().split('\n').length)
                })
                input.on('keydown', (e)=>{
                    if (e.keyCode == 13 && !e.shiftKey) {
                        e.preventDefault()
                        input.trigger('change')
                    }
                })
                input.appendTo(wrapper)

            }

            if (typeof params[i]=='boolean') {

               var toggle = $(`<span class="checkbox ${data[i]?'on':''}">${icon('check')}</span>`)
               toggle.appendTo(wrapper)

               toggle.click(function(){
                   input.val(!eval(input.val())).trigger('change')
               })

           }

            input.on('change',function(){

                var title = input.attr('title'),
                    v

                try {
                    v = JSON.parseFlex(input.val())
                } catch(err) {
                    v = input.val()
                }

                data[title] = v

                if (v==='') delete data[title]

                try {
                    updateWidget(widget)
                    wrapper.removeClass('error')
                } catch (err) {
                    wrapper.addClass('error')
                    throw err
                }
            })

        }

    }

    // widget list edit
    if ((params.widgets || (container.hasClass('tab'))) && (!data.tabs||!data.tabs.length)) {

        $(`<div class="separator"><span>Widgets</span></div>`).appendTo(form)

        var list = $('<ul class="input"></ul>'),
            wrapper = $('<div class="input-wrapper column"></div>').appendTo(form)

        var editItem = function(i) {
            return function(){
                container.find('.widget').first().siblings().addBack().eq(i).trigger(ev)
            }
        }

        for (var i in data.widgets) {


            var item = $(`<li data-index="${i}" class="sortables" data-id="${data.widgets[i].id}"><a class="btn small">${data.widgets[i].id||data.widgets[i].label}</a></li>`)
                       .appendTo(list)
                       .click(editItem(i))

            var remove = $('<span><i class="fa fa-remove"></i></span>')
                          .appendTo(item)
                          .click(function(e){
                              e.stopPropagation()
                              data.widgets.splice($(this).parent().attr('data-index'),1)
                              updateWidget(widget)
                          })
        }

        list.sortable({
            items: '.sortables',
            placeholder: "sortable-placeholder btn small",
            start:function(){$(this).sortable( "refreshPositions" )},
            update: function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.widgets.splice(newIndex, 0, data.widgets.splice(prevIndex, 1)[0])

                updateWidget(widget)
            }
        })

        var add = $(`<li><a class="btn small">${icon('plus')}</a></li>`).appendTo(list).click(function(){
            data.widgets = data.widgets || []
            data.widgets.push({})

            updateWidget(widget)
        })

        list.appendTo(wrapper)

    }

    // tab list edit
    if ((params.tabs || (container.hasClass('tab'))) && (!data.widgets||!data.widgets.length)) {

        $(`<div class="separator"><span>Tabs</span></div>`).appendTo(form)

        //tabs
        var list = $('<ul class="input"></ul>'),
            wrapper = $('<div class="input-wrapper column"></div>').appendTo(form)


        var editItem = function(i) {
            return function(){
                container.find('.tablist li').first().siblings().addBack().eq(i).trigger(ev)
            }
        }

        for (var i in data.tabs) {
            var item = $(`<li data-index="${i}" class="sortables"><a class="btn small">${data.tabs[i].id}</a></li>`)
                        .appendTo(list)
                        .click(editItem(i))

            var remove = $('<span><i class="fa fa-remove"></i></span>')
                          .appendTo(item)
                          .click(function(e){
                              e.stopPropagation()
                              data.tabs.splice($(this).parent().attr('data-index'),1)
                              updateWidget(widget)
                          })
        }

        list.sortable({
            items: '.sortables',
            placeholder: "sortable-placeholder btn small",
            start:function(){$(this).sortable( "refreshPositions" )},
            update: function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.tabs.splice(newIndex, 0, data.tabs.splice(prevIndex, 1)[0])

                updateWidget(widget)
            }
        })

        var add = $(`<li><a class="btn small">${icon('plus')}</a></li>`).appendTo(list).click(function(){
            data.tabs = data.tabs || []
            data.tabs.push({})

            updateWidget(widget)
        })

        list.appendTo(wrapper)
    }

    if (data.hasOwnProperty('width') || data.hasOwnProperty('height')) {
        var handleTarget
        container.resizable({
            handles: 's, e, se',
            helper: "ui-helper",
            start: function(event, ui){
                handleTarget = $(event.originalEvent.target)
            },
            resize: function(event, ui) {
                ui.size.height = Math.round(ui.size.height / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                ui.size.width = Math.round(ui.size.width / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
            },
            stop: function( event, ui ) {
                if (handleTarget.hasClass('ui-resizable-se') || handleTarget.hasClass('ui-resizable-s')) data.height = Math.round((Math.max(ui.size.height,1)) / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH
                if (handleTarget.hasClass('ui-resizable-se') || handleTarget.hasClass('ui-resizable-e')) data.width =  Math.round(ui.size.width / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH
                updateWidget(widget)
            },
            grid: [GRIDWIDTH * PXSCALE, GRIDWIDTH * PXSCALE]
        })
    }

    if (data.hasOwnProperty('top')) {
        container.draggable({
                cursor:'-webkit-grabbing',
                drag: function(event, ui) {
                    ui.position.top = Math.round(ui.position.top / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                    ui.position.left = Math.round(ui.position.left / (GRIDWIDTH * PXSCALE)) * GRIDWIDTH * PXSCALE
                },
                stop: function( event, ui ) {
                    event.preventDefault()
                    data.top = (ui.helper.position().top + container.parent().scrollTop())/PXSCALE
                    data.left = (ui.helper.position().left + container.parent().scrollLeft())/PXSCALE
                    ui.helper.remove()
                    updateWidget(widget)
                },
                handle:'.ui-draggable-handle, > .label',
                grid: [GRIDWIDTH * PXSCALE, GRIDWIDTH * PXSCALE],
                helper:function(){return $('<div class="ui-helper"></div>').css({height:container.outerHeight(),width:container.outerWidth()})}
        }).append('<div class="ui-draggable-handle"></div>')
    }

    form.appendTo('.editor-container')

}


module.exports = {
    editObject:editObject,
    editClean:editClean
}
