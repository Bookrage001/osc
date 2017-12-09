var widgetManager = require('./widgets'),
    {saveAs} = require('file-saver')


var StateManager = class StateManager {

    constructor() {

        this.state = []

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

    send() {

        this.set(this.get(),true)

    }

    load() {

        var prompt = $('<input type="file" accept=".state"/>')

        prompt.click()

        prompt.on('change',(e)=>{

            var reader = new FileReader()

            reader.onloadend = (e)=>{

                var preset = e.target.result
                this.set(JSON.parse(preset),true)
                this.state = preset

            }

            reader.readAsText(e.target.files[0],'utf-8')

        })

    }

    save() {

        var state = JSON.stringify(this.get(),null,'    ')
        var blob = new Blob([state],{type : 'application/json'})
        saveAs(blob, new Date().toJSON().slice(0,10)+'_'+new Date().toJSON().slice(11,16) + '.state')

    }

    quickSave(state) {

        if (state) {

            this.state = state

        } else {

            this.state = this.get()

        }

    }

    quickLoad() {

        this.set(this.state,true)

    }


}

var stateManager = new StateManager()

module.exports = stateManager
