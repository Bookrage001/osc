var widgetManager = require('./widgets'),
    {upload} = require('../ui/utils'),
    notifications = require('../ui/notifications'),
    {saveAs} = require('file-saver'),
    locales = require('../locales')


var StateManager = class StateManager {

    constructor() {

        this.quickState = []

        this.valueStateQueue = {}
        this.valueOldPropQueue = {}
        this.valueNewPropQueue = {}
        this.queueCounter = 0

    }

    get() {

        var data = []

        for (let i in widgetManager.widgets) {

            var widget = widgetManager.widgets[i]

            if (widget.setValue && widget.getValue) {

                var v = widget.getValue()

                if (v!=undefined) {

                    data.push([widget.getProp('id'),v])
                    continue

                }

            }
        }

        return data

    }

    set(preset,send) {

        for (let i in preset) {

            var data = preset[i],
                widgets = widgetManager.getWidgetById(data[0])

            if (widgets.length) {

                for (var j=widgets.length-1;j>=0;j--) {

                    if (widgets[j].setValue) {

                        widgets[j].setValue(data[1],{send:send,sync:true})

                    }

                }

            }

        }

    }

    send(options) {

        for (let i in widgetManager.widgets) {

            var widget = widgetManager.widgets[i]

            if (widget.sendValue) {
                widget.sendValue(null, options)
            }
        }

    }

    load() {

        function stateLoadError(){
            notifications.add({
                class: 'error',
                message: locales('state_uploaderror')
            })
        }

        upload('.state', (path, result)=>{
            try {
                this.set(JSON.parse(result),true)
                notifications.add({
                    icon: 'sliders-h',
                    message: locales('state_recallsuccess')
                })
            } catch(e) {
                stateLoadError()
            }
        }, (e)=>{
            stateLoadError()
        })

    }

    save() {

        var state = JSON.stringify(this.get(),null,'    ')
        var blob = new Blob([state],{type : 'application/json'})
        saveAs(blob, new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16) + '.state')

    }

    quickSave(state) {

        if (state) {

            this.quickState = state

        } else {

            this.quickState = this.get()

        }

    }

    quickLoad() {

        this.set(this.quickState,true)

    }

    pushValueState(id, value) {
        this.valueStateQueue[id] = value
    }

    pushValueOldProp(id, value) {
        this.valueOldPropQueue[id] = typeof value == 'object' ? JSON.stringify(value) : value
    }

    pushValueNewProp(id, value) {
        this.valueNewPropQueue[id] = typeof value == 'object' ? JSON.stringify(value) : value
        if (this.queueCounter == 0) this.flush()
    }

    flush(){
        for (let id in this.valueStateQueue) {
            if (this.valueStateQueue[id] !== undefined) {
                for (let w of widgetManager.getWidgetById(id)) {
                    w.setValue(this.valueStateQueue[id], {sync: true})
                }
            }
        }

        for (let id in this.valueNewPropQueue) {
            if (this.valueNewPropQueue[id] != this.valueOldPropQueue[id]) {
                for (let w of widgetManager.getWidgetById(id)) {
                    w.setValue(w.getProp('value'), {sync: true})
                }
            }
        }

        this.valueStateQueue = {}
        this.valueOldPropQueue = {}
        this.valueNewPropQueue = {}
    }

    incrementQueue() {
        this.queueCounter++
    }

    decrementQueue() {
        this.queueCounter--
        if (this.queueCounter == 0) this.flush()
    }

}

var stateManager = new StateManager()

module.exports = stateManager
