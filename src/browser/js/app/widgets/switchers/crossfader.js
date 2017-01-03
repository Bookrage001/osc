var Switcher = require('./switcher'),
    Fader = require('../sliders/fader'),
    {mapToScale, clip} = require('../utils')

module.exports = class Crossfader extends Switcher {

    static options(){

        var o = super.options()
        delete o.values

        return o

    }

    constructor(widgetData) {

        widgetData.values = widgetData.horizontal ? ['A', 'B'] : ['B', 'A']

        super(...arguments)


        var o = Fader.options()
        o.horizontal = widgetData.horizontal
        o.range = {min:{'A':0}, '50%':{" ":0.5},max:{'B':1}}

        this.fader = new Fader(o, 0)

        this.widget.append($('<div class="fader-container"></div>').append(this.fader.widget))

        this.fader.widget.on('sync', (e)=>{

            e.stopPropagation()

            if (this.fader.value == 0) {
                this.setValue('A', e.options)
            } else if (this.fader.value == 1) {
                this.setValue('B', e.options)
            } else {
                this.setValue(this.fader.getValue(), e.options)
            }

        })

    }

    setValue(v, options={}) {

        super.setValue(...arguments)

        if (typeof v == 'object') {

            this.fader.setValue(this.value._fader)

        }

        if (v == 'A' || v <= 0) {

            this.fader.setValue(0)
            this.value._fader = 0


        } else if (v == 'B' || v >= 1) {

            this.fader.setValue(1)
            this.value._fader = 1


        } else if (!isNaN(v)) {

            this.fader.setValue(v)
            this.value._fader = this.fader.getValue()
            this.value._selected = false
            this.switch.setValue()

            var s = this.getValue(),
                a = {}

            for (var i in s['A']) {

                if (s['B'][i] === undefined) continue

                if (Array.isArray(s['A'][i])) {

                    a[i] = []

                    for (var k in s['A'][i]) {

                        if (!isNaN(s['A'][i][k])) {

                            a[i][k] = mapToScale(v, [0,1], [s['A'][i][k], s['B'][i][k]], false)

                        }

                    }

                } else if (!isNaN(s['A'][i])) {

                    a[i] = mapToScale(v, [0,1], [s['A'][i], s['B'][i]], false)
                }
            }

            this.applyState(a, options)

        }

    }

}
