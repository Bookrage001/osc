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

            inputs: {type: 'array', value: ['input_1', 'input_2'], help: [
                'Patchbay inputs can be connected to one or more outputs and will send messages of the following form when they are connected/disconnected: ',
                '`/patchbay_address input_x output_x output_y etc`',
                'If no output is connected to the input, the message will be `/patchbay_address input_x`',
                'The inputs values can be consumed with the property inheritance syntax `@{patchbay_id/input_1}` returns an array of output names connected to `input_1`'
            ]},
            outputs: {type: 'array', value: ['output_1', 'output_2'], help: 'List of output values the inputs can connect to.'},

        })

    }

    constructor(options) {

        super({...options, html: html`
            <div class="patchbay">
                <div class="nodes inputs"></div>
                <canvas></canvas>
                <div class="nodes outputs"></div>
            </div>
        `})

        this.inputs = []
        this.inputNodes = []
        this.outputNodes = []

        for (let i in this.getProp('inputs')) {
            let w = parser.parse({
                data: {
                    type: 'patchbaynode',
                    label: this.getProp('inputs')[i],
                    id: this.getProp('id') + '/' + this.getProp('inputs')[i],
                    address: '@{parent.address}',
                    target: '@{parent.target}',
                    preArgs: this.getProp('inputs')[i],
                    bypass: '@{parent.bypass}',

                },
                parentNode: DOM.get(this.widget, '.inputs')[0],
                parent: this
            })
            w.container.classList.add('not-editable')
            this.inputs.push(w)
            this.inputNodes.push(w.container)
        }

        for (let i in this.getProp('outputs')) {
            var outputs = DOM.get(this.widget, '.outputs')[0],
                node = html`
                <div class="widget">
                    <div class="label">${this.getProp('outputs')[i]}</div>
                </div>
            `
            outputs.appendChild(node)
            this.outputNodes.push(node)
        }


        this.connecting = []

        this.widget.addEventListener('fast-click', (e)=>{
            this.toggleConnection(e.target)
        })


        this.mousePosition = []
        this.dragging = false
        this.on('drag', (e)=>{
            this.dragging = true
            if (!this.connecting.length) {
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
            this.inputs[this.connecting[0]].toggleValue(this.getProp('outputs')[this.connecting[1]])
            this.connecting = []
        } else {

            this.batchDraw()

        }

    }

    draw() {

        this.clear()

        var x1 = 0,
            x2 = this.width,
            y1, y2,
            connections,
            i, j,
            inputs = this.getProp('inputs'),
            outputs = this.getProp('outputs')

        this.ctx.globalAlpha = 0.7
        this.ctx.lineWidth = 2 * PXSCALE
        this.ctx.strokeStyle = this.colors.custom
        this.ctx.beginPath()

        for (i = 0; i < this.inputs.length; i++) {

            connections = this.inputs[i].getValue()

            if (connections.length) {

                y1 = this.height / inputs.length * (i + 0.5)

                for (j in connections) {

                    if (outputs.indexOf(connections[j]) > -1) {

                        y2 = this.height / outputs.length * (outputs.indexOf(connections[j]) + 0.5)

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
                cy = this.height / (side === 0 ? inputs : outputs).length * (this.connecting[side] + 0.5)

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
