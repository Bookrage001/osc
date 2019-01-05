var Widget = require('../common/widget'),
    Canvas = require('../common/canvas'),
    parser = require('../../parser'),
    html = require('nanohtml')

class PatchBayNode extends Widget {

    constructor(options) {

        super({...options, html: html`
            <div class="node">
            </div>
        `})

        this.value = []

    }

    setValue(v, options={} ) {

        this.value = Array.isArray(v) ? v : v ? [v] : []

        var allowed = this.parent.getProp('outputs')
        for (var i = this.value.length -1; i > -1; i--) {
            if (allowed.indexOf(this.value[i]) === -1) {
                this.value.splice(i, 1)
            }
        }

        this.parent.batchDraw()

        if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

    toggleValue(v) {

        var index = this.value.indexOf(v)

        if (index > -1) {
            this.value.splice(index, 1)
        } else {
            this.value.push(v)
        }

        this.setValue(this.value, {sync: true, send: true})

    }


}

class PatchBay extends Canvas {

    static defaults() {

        return super.defaults({

            _patchbay:'patchbay',

            inputs: {type: 'array|object', value: ['input_1', 'input_2'], help: [
                '- `Array` of input names : `[\'input_1\', \'input_2\']`',
                '- `Object` of `"label_1": "input_1"` pairs. Numeric labels must be prepended or appended with a white space (or any other non-numeric character) otherwise the order of the values won\'t be kept',
                '',
                'Patchbay inputs can be connected to one or more outputs and will send messages of the following form when they are connected/disconnected: ',
                '`/patchbay_address input_x output_x output_y etc`',
                'If no output is connected to the input, the message will be `/patchbay_address input_x`',
                'The inputs values can be consumed with the property inheritance syntax: `@{patchbay_id/input_1}` returns an array of output names connected to `input_1`'
            ]},
            outputs: {type: 'array|object', value: ['output_1', 'output_2'], help: 'List of output values the inputs can connect to (see `inputs`).'},

        }, [], {

            css: {type: 'string', value: '', help: [
                'The inputs/ouputs width can be adjusted by using the  `.nodes` selector:',
                '`.nodes { width: 25% }`',
            ]}
        })

    }

    static normalizeArrayObject(obj) {

        if (typeof obj !== 'object' || obj === null) {
            return PatchBay.normalizeArrayObject([obj])
        } else if (Array.isArray(obj)) {
            var ret = {},
                k, i
            for (i = 0; i < obj.length; i++) {
                k = typeof obj[i] === 'string' ? obj[i] : JSON.stringify(obj[i])
                ret[k] = obj[i]
            }
            return ret
        } else {
            return obj
        }

    }

    constructor(options) {

        super({...options, html: html`
            <div class="patchbay">
                <div class="nodes inputs"></div>
                <canvas></canvas>
                <div class="nodes outputs"></div>
            </div>
        `})

        this.inputs = PatchBay.normalizeArrayObject(this.getProp('inputs'))
        this.outputs = PatchBay.normalizeArrayObject(this.getProp('outputs'))
        this.inputsValues = Object.values(this.inputs)
        this.outputsValues = Object.values(this.outputs)

        this.inputsWidgets = []
        this.inputNodes = []
        this.outputNodes = []


        for (let k in this.inputs) {
            let w = parser.parse({
                data: {
                    type: 'patchbaynode',
                    label: k,
                    id: this.getProp('id') + '/' + this.inputs[k],
                    address: '@{parent.address}',
                    target: '@{parent.target}',
                    preArgs: this.inputs[k],
                    bypass: '@{parent.bypass}',

                },
                parentNode: DOM.get(this.widget, '.inputs')[0],
                parent: this
            })
            w.container.classList.add('not-editable')
            this.inputsWidgets.push(w)
            this.inputNodes.push(w.container)
        }

        var outputs = DOM.get(this.widget, '.outputs')[0]
        for (let k in this.outputs) {
            var node = html`
                <div class="widget">
                    <div class="label">${k}</div>
                </div>
            `
            outputs.appendChild(node)
            this.outputNodes.push(node)
        }


        this.connecting = []

        this.widget.addEventListener('fast-click', (e)=>{
            this.toggleConnection(e.target)
            e.stopPropagation()
        })


        this.mousePosition = []
        this.dragging = false
        this.on('drag', (e)=>{
            this.dragging = true
            if (!this.connecting.length) {
                this.toggleConnection(e.target)
            }
            if (e.target === this.canvas) {
                this.mousePosition = [e.offsetX, e.offsetY]
            } else if (this.mousePosition.length) {
                this.mousePosition[0] += e.movementX
                this.mousePosition[1] += e.movementY
            }
            this.batchDraw()
        }, {element: this.widget})
        this.on('dragend', (e)=>{
            this.dragging = false
            if (this.mousePosition.length) {
                this.mousePosition = []
                this.toggleConnection(e.target)
            }
        }, {element: this.widget})


    }

    toggleConnection(node) {

        var input = this.inputNodes.indexOf(node),
            output = this.outputNodes.indexOf(node)

        if (input > -1 && input !== this.connecting[0]) {
            this.connecting[0] = input
        } else if (output > -1 && output !== this.connecting[1]) {
            this.connecting[1] = output
        } else {
            this.connecting = []
        }

        if (this.connecting[0] !== undefined && this.connecting[1] !== undefined) {
            this.inputsWidgets[this.connecting[0]].toggleValue(this.outputsValues[this.connecting[1]])
            this.connecting = []
        } else {
            this.batchDraw()
        }

        if (this.connecting.length) {
            var cb = (e)=>{
                this.toggleConnection()
                document.removeEventListener('fast-click', cb)
            }
            document.addEventListener('fast-click', cb)
        }

    }

    draw() {

        this.clear()

        var x1 = 0,
            x2 = this.width,
            y1, y2,
            connections,
            i, j

        this.ctx.globalAlpha = 0.7
        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.strokeStyle = this.colors.custom
        this.ctx.beginPath()

        for (i = 0; i < this.inputsWidgets.length; i++) {

            connections = this.inputsWidgets[i].getValue()

            if (connections.length) {

                y1 = this.height / this.inputsValues.length * (i + 0.5)

                for (j in connections) {

                    if (this.outputsValues.indexOf(connections[j]) > -1) {

                        y2 = this.height / this.outputsValues.length * (this.outputsValues.indexOf(connections[j]) + 0.5)

                        this.ctx.moveTo(x1, y1)
                        this.ctx.bezierCurveTo(this.width / 2, y1, this.width / 2, y2 ,x2, y2)

                    }

                }


            }

        }

        this.ctx.stroke()

        if (this.connecting.length) {

            this.ctx.beginPath()
            this.ctx.fillStyle = this.colors.custom

            var side = this.connecting[0] !== undefined ? 0 : 1,
                cx = side === 0 ? 0 : this.width,
                cy = this.height / (side === 0 ? this.inputsValues : this.outputsValues).length * (this.connecting[side] + 0.5)

            this.ctx.arc(cx, cy, 8 * PXSCALE, Math.PI * 2, false)
            this.ctx.fill()

            if (this.mousePosition.length) {
                var [x3, y3] = this.mousePosition,
                    centerx = Math.abs(cx - x3) / 2,
                    bz1 = side ? cx - centerx : cx + centerx,
                    bz2 = side ? x3 + centerx : x3 - centerx

                this.ctx.beginPath()
                this.ctx.moveTo(cx, cy)
                this.ctx.bezierCurveTo(bz1, cy, bz2, y3 ,x3, y3)
                this.ctx.stroke()

            }

        }


    }

}

module.exports = {
    PatchBay,
    PatchBayNode
}
