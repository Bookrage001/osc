var widgetCategories = require('../widgets/').categories,
    {updateWidget} = require('./data-workers'),
    widgetManager = require('../managers/widgets'),
    {icon} = require('../ui/utils')

module.exports = function editField(editor, widget, propName, defaultValue){

    let dynamic = widget.constructor.dynamicProps.includes(propName)

    let field = DOM.create(`
        <div class="input-wrapper ${widget.errors[propName] ? 'error' : ''}">
            <label ${dynamic ? 'class="dynamic"': ''} title="${widget.errors[propName] || (dynamic ? 'dynamic' : '')}">${propName}</label>
        </div>
    `)

    let input

    if (propName !== 'widgets' && propName !== 'tabs') {

        if (propName == 'type') {

            if (widget.props.type == 'tab' || widget.props.type == 'root') return

            input = DOM.create(`<select class="input" title="${propName}"/>`)

            for (let category in widgetCategories) {
                input.innerHTML += `<optgroup label="> ${category}">`
                for (let type of widgetCategories[category]) {
                    input.innerHTML += `<option ${type == widget.props.type ? 'selected' : ''} value="${type}">${type}</option>`
                }
                input.innerHTML += `</optgroup>`
            }

            var wrapper = DOM.create(`<div class="select-wrapper"></div>`)
            wrapper.appendChild(input)
            field.appendChild(wrapper)


        } else {

            var value = typeof widget.props[propName] !== 'string' ?
                    JSON.stringify(widget.props[propName], null, '  ').replace(/\n\s\s\s\s/g, ' ').replace(/\n\s\s(\}|\])/g, ' $1') : widget.props[propName]

            input = DOM.create(`<textarea class="input" title="${propName}" rows="${value.split('\n').length}">${value}</textarea>`)

            DOM.addEventListener(input, ['input', 'focus'], ()=>{
                input.setAttribute('rows',0)
                input.setAttribute('rows', input.value.split('\n').length)
            })

            input.addEventListener('keydown', (e)=>{
                if (e.keyCode == 13 && !e.shiftKey) {
                    e.preventDefault()
                    DOM.dispatchEvent(input, 'change')
                }
            })

            if (typeof defaultValue === 'boolean') {

               var toggle = DOM.create(`
                   <span class="checkbox ${widget.props[propName] ? 'on' : ''}">
                       ${icon('check')}
                   </span>
               `)

               toggle.addEventListener('click', ()=>{
                   input.value = !widget.getProp(propName)
                   DOM.dispatchEvent(input, 'change')
               })

               field.appendChild(toggle)

           }

           field.appendChild(input)

        }

        var onChange = ()=>{

            input.removeEventListener('change', onChange)

            var v

            try {
                v = JSON.parseFlex(input.value)
            } catch(err) {
                v = input.value
            }

            widget.props[propName] = v !== '' ? v : JSON.parse(JSON.stringify(defaultValue))

            updateWidget(widget)

        }

        input.addEventListener('change', onChange)


    } else if (
        (propName === 'widgets' && (!widget.props.tabs ||! widget.props.tabs.length)) ||
        (propName === 'tabs' && (!widget.props.widgets ||! widget.props.widgets.length))
    ) {

        var list = DOM.create('<ul></ul>')

        for (var i in widget.props[propName]) {

            list.appendChild(DOM.create(`
                <li class="sortables">
                    <a class="btn small" data-action="select">${widget.props[propName][i].id}</a>
                    <span data-action="remove"><i class="fa fa-times"></i></span>
                </li>
            `))

        }

        list.appendChild(DOM.create(`
            <li><a class="btn small" data-action="add">${icon('plus')}</a></li>
        `))


        list.addEventListener('click', (e)=>{
            // e.stopPropagation()
            var change
            switch (e.target.getAttribute('data-action')) {

                case 'select':
                    editor.select(widgetManager.getWidgetByElement(DOM.get(propName === 'widgets' ? widget.widget : widget.wrapper, '> .widget')[DOM.index(e.target.closest('li'))]))
                    break

                case 'remove':
                    widget.props[propName].splice(DOM.index(e.target.closest('li')),1)
                    change = true
                    break

                case 'add':
                    widget.props[propName] = widget.props[propName] || []
                    widget.props[propName].push({})
                    change = true
                    break

            }

            if (change) {
                updateWidget(widget)
            }

        })

        var $list = $(list)
        $list.sortable({
            items: '.sortables',
            placeholder: "sortable-placeholder btn small",
            start:function(){$(this).sortable( "refreshPositions" )},
            update: function(e,ui){
                var oldindex = $(ui.item).attr('data-index')
                var index  = $(ui.item).index()

                widget.props[propName].splice(index, 0, widget.props[propName].splice(oldindex, 1)[0])
                updateWidget(widget)
            }
        })

        input = DOM.create('<div class="input column"></div>')
        input.appendChild(list)
        field.appendChild(input)

    }

    if (input) {
        return field
    }

}
