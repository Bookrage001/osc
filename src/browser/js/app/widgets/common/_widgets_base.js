var osc = require('../../osc')


module.exports = class {

    static options() {

        throw 'Calling unimplemented static options() method'

    }

    constructor(widgetData, widgetContainer, widgetHtml) {

        this.container = widgetContainer
        this.widget = $(widgetHtml)
        this.widgetData = widgetData

    }

    sendValue() {

        var args = this.widgetData.preArgs.concat(this.value)

        osc.send({
            target:this.widgetData.target,
            address:this.widgetData.address,
            precision:this.widgetData.precision,
            args:args,
            syncOnly:this.split?true:false
        })

        if (this.split) {
            var n = 0
            for (i in this.split) {
                osc.send({
                    target:this.widgetData.target,
                    address:this.split[i],
                    precision:this.widgetData.precision,
                    args:this.widgetData.preArgs.concat(this.value[n]),
                    sync:false

                })
                n++
            }
        }

    }

    getValue() {

        if (typeof this.value == 'object') {

            return (()=>{

                var a = []

                for (i in this.value)  {
                    a.push(this.value[i])
                }

                return a

            })()

        } else {

            return this.value

        }

    }

}
