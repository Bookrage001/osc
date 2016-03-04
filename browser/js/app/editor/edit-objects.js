var updateDom = require('./data-workers').updateDom,
    widgetOptions = require('../widgets').widgetOptions

var editObject = function(container, data, refresh){

    if (!refresh && (container.hasClass('editing') || $(`a[data-tab="#${container.attr('id')}"]`).hasClass('editing'))) return

    $('.editing').removeClass('editing')
    $(`a[data-tab="#${container.attr('id')}"]`).addClass('editing').click()
    $(container).addClass('editing')

    $('.editor-container').remove()
    $('.editor').append('<div class="editor-container"></div>')
    var form = $('<div class="form"></div>').appendTo('.editor-container')

    var isWidget = container.hasClass('widget')

    var params = isWidget?widgetOptions[data.type]:{label:''}

    for (i in params) {

        if (i.indexOf('separator')!=-1) {
            $(`<div class="separator"><span>${params[i]}</span></div>`).appendTo(form)
            continue
        } else if (data[i]===undefined) {
            continue
        }

        // Common options edit
        if (i!='widgets' && i!='tabs') {

            var type = typeof data[i],
                value = type == 'object'?JSON.stringify(data[i]):data[i],
                label = $(`<label>${i}</label>`).appendTo(form),
                input

            if (i=='type') {

                input = $(`<select class="input" data-type="${type}" title="${i}"/>`)

                for (t in widgetOptions) {
                    input.append(`<option ${t==value?'selected=':''} value="${t}">${t}</option>`)
                }
                select = $('<div class="select-wrapper"></div>').append(input)
                select.appendTo(form)

            } else if (typeof params[i]=='boolean') {

                input = $(`<input class="checkbox" data-type="${type}" value='${value}' title="${i}"/>`)
                input.click(function(){
                    $(this).val(!eval($(this).val())).trigger('change')
                })
                input.appendTo(form)

            } else {

                input = $(`<input data-type="${type}" value='${value}' title="${i}"/>`)
                input.appendTo(form)

            }


            input.on('change',function(){
                var v = $(this).val()!= '' && $(this).data('type') == 'object'?JSON.parse($(this).val()):$(this).val()
                data[$(this).attr('title')]= v=='true'||v=='false'?eval(v):v
                if (v=='') delete data[$(this).attr('title')]
                updateDom(container,data)
            })

        }

    }

    // widget list edit
    if (((isWidget&&widgetOptions[data.type].widgets) || (container.hasClass('tab'))) && (!data.tabs||!data.tabs.length)) {

        var list = $('<ul class="input"></ul>')

        var editItem = function(i) {
            return function(){
                container.find('.widget').first().siblings().addBack().eq(i).trigger('mousedown.editor')
            }
        }

        for (i in data.widgets) {


            var item = $(`<li data-index="${i}" class="sortables" data-id="${data.widgets[i].id}"><a class="btn small">${data.widgets[i].id||data.widgets[i].label}</a></li>`)
                       .appendTo(list)
                       .click(editItem(i))

            var remove = $('<span><i class="fa fa-remove"></i></span>')
                          .appendTo(item)
                          .click(function(e){
                              e.stopPropagation()
                              data.widgets.splice($(this).parent().attr('data-index'),1)
                              updateDom(container,data)
                          })
        }

        list.sortable({
            forcePlaceholderSize: true,
            items: '.sortables',
            start:function(){$(this).sortable( "refreshPositions" )},
            update: function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.widgets.splice(newIndex, 0, data.widgets.splice(prevIndex, 1)[0])

                updateDom(container,data)
            }
        })

        var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
            data.widgets = data.widgets || []
            data.widgets.push({})

            updateDom(container,data)
        })

        $('<label>widgets</label>').appendTo(form)
        list.appendTo(form)

    }

    // tab list edit
    if (((isWidget&&widgetOptions[data.type].tabs) || (container.hasClass('tab'))) && (!data.widgets||!data.widgets.length)) {
        //tabs
        var list = $('<ul class="input"></ul>')

        var editItem = function(i) {
            return function(){
                container.find('.tab').first().siblings().addBack().eq(i).trigger('mousedown.editor')
            }
        }

        for (i in data.tabs) {
            var item = $(`<li data-index="${i}" class="sortables"><a class="btn small">${data.tabs[i].label}</a></li>`)
                        .appendTo(list)
                        .click(editItem(i))

            var remove = $('<span><i class="fa fa-remove"></i></span>')
                          .appendTo(item)
                          .click(function(e){
                              e.stopPropagation()
                              data.tabs.splice($(this).parent().attr('data-index'),1)
                              updateDom(container,data)
                          })
        }

        list.sortable({
            start:function(){$(this).sortable( "refreshPositions" )},
            forcePlaceholderSize: true,
            items: '.sortables',
            update: function(e,ui){
                var prevIndex = $(ui.item).attr('data-index')
                var newIndex  = $(ui.item).index()

                data.tabs.splice(newIndex, 0, data.tabs.splice(prevIndex, 1)[0])

                updateDom(container,data)
            }
        })

        var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
            data.tabs = data.tabs || []
            data.tabs.push({})

            updateDom(container,data)
        })
        $('<label>tabs</label>').appendTo(form)
        list.appendTo(form)
    }


    $('.widget.ui-resizable').resizable('destroy')
    if (data.hasOwnProperty('width')) {
        var handleTarget
        container.resizable({
            handles:'s, e, se',
            helper: "ui-helper",
            start: function(event, ui){
                handleTarget = $(event.originalEvent.target)
            },
            stop: function( event, ui ) {
                if (handleTarget.hasClass('ui-resizable-se') || handleTarget.hasClass('ui-resizable-s')) data.height = Math.max(ui.size.height,30)
                if (handleTarget.hasClass('ui-resizable-se') || handleTarget.hasClass('ui-resizable-e')) data.width = Math.max(ui.size.width,30)
                updateDom(container,data)
            },
            snap:'.tab.on .widget, .tab.on',
            snapTolerance:5
        })
    }

    $('.widget.ui-draggable').draggable('destroy').find('.ui-draggable-handle').remove()
    if (data.hasOwnProperty('top')) {
        container.draggable({
                stop: function( event, ui ) {
                    event.preventDefault()
                    data.top = ui.helper.position().top + container.parent().scrollTop()
                    data.left = ui.helper.position().left + container.parent().scrollLeft()
                    ui.helper.remove()
                    updateDom(container,data)
                },
                handle:'.ui-draggable-handle',
                snap:'.tab.on .widget, .tab.on',
                snapTolerance:5,
                helper:function(){return $('<div class="ui-helper"></div>').css({height:container.outerHeight(),width:container.outerWidth()})}
        }).append('<div class="ui-draggable-handle"></div>')
    }

}

var editSession = function(container,data,refresh){

    if (!refresh && $('.editor-root').hasClass('editing')) return

    $('.editing').removeClass('editing')
    $('.editor-root').addClass('editing')

    $('.editor-container').remove()
    $('.editor').append('<div class="editor-container"></div>')


    var form = $('<div class="form"></div>').appendTo('.editor-container'),
        list = $('<ul class="input"></ul>')

    var editItem = function(i) {
        return function(){
            container.find('.tab').first().siblings().addBack().eq(i).trigger('mousedown.editor')
        }
    }

    for (i in data) {
        var item = $(`<li data-index="${i}" class="sortables"><a class="btn small">${data[i].label}</a></li>`)
                    .appendTo(list)
                    .click(editItem(i))

        var remove = $('<span><i class="fa fa-remove"></i></span>')
                      .appendTo(item)
                      .click(function(e){
                          e.stopPropagation()
                          data.splice($(this).parent().attr('data-index'),1)
                          updateDom(container,data)
                      })
    }


    list.sortable({
        start:function(){$(this).sortable( "refreshPositions" )},
        forcePlaceholderSize: true,
        items: '.sortables',
        update: function(e,ui){
            var prevIndex = $(ui.item).attr('data-index')
            var newIndex  = $(ui.item).index()

            data.splice(newIndex, 0, data.splice(prevIndex, 1)[0])

            updateDom(container,data)
        }
    })

    var add = $(`<li><a class="btn small">+</a></li>`).appendTo(list).click(function(){
        data = data || []
        data.push({})

        updateDom(container,data)
    })

    $('<label>tabs</label>').appendTo(form)
    list.appendTo(form)


    $('.editor-container').append(form)

}

module.exports = {
    editObject:editObject,
    editSession:editSession
}
