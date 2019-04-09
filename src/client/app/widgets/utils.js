module.exports = {

    clip: function(value,range) {

        value = parseFloat(value)

        if (isNaN(value)) value = range[0]
        return Math.max(Math.min(range[0],range[1]),Math.min(value,Math.max(range[0],range[1])))

    },

    // map a value from a scale to another input and output must be range arrays
    mapToScale: function(value,rangeIn,rangeOut,precision,log,revertlog) {

        value = module.exports.clip(value,[rangeIn[0],rangeIn[1]])

        value =  log ?
            revertlog ?
                (Math.pow(10,((value-rangeIn[0])/(rangeIn[1]-rangeIn[0])))/9-1/9) * (rangeOut[1]-rangeOut[0]) + rangeOut[0]
                :Math.log10(((value-rangeIn[0])/(rangeIn[1]-rangeIn[0]))*9+1) * (rangeOut[1]-rangeOut[0]) + rangeOut[0]
            :((value-rangeIn[0])/(rangeIn[1]-rangeIn[0])) * (rangeOut[1]-rangeOut[0]) + rangeOut[0]

        value = Math.max(Math.min(rangeOut[0],rangeOut[1]),Math.min(value,Math.max(rangeOut[0],rangeOut[1])))

        if (precision !== false) value = parseFloat(value.toFixed(precision))


        return value

    },

    hsbToRgb: function(hsb) {
        var rgb = {}
        var h = hsb.h
        var s = hsb.s*255/100
        var v = hsb.b*255/100
        if(s == 0) {
            rgb.r = rgb.g = rgb.b = v
        } else {
            var t1 = v
            var t2 = (255-s)*v/255
            var t3 = (t1-t2)*(h%60)/60
            if(h==360) h = 0
            if(h<60) {rgb.r=t1;    rgb.b=t2; rgb.g=t2+t3}
            else if(h<120) {rgb.g=t1; rgb.b=t2;    rgb.r=t1-t3}
            else if(h<180) {rgb.g=t1; rgb.r=t2;    rgb.b=t2+t3}
            else if(h<240) {rgb.b=t1; rgb.r=t2;    rgb.g=t1-t3}
            else if(h<300) {rgb.b=t1; rgb.g=t2;    rgb.r=t2+t3}
            else if(h<360) {rgb.r=t1; rgb.g=t2;    rgb.b=t1-t3}
            else {rgb.r=0; rgb.g=0;    rgb.b=0}
        }
        return rgb
    },

    rgbToHsb: function(rgb) {
        var hsb = {h: 0, s: 0, b: 0}
        var min = Math.min(rgb.r, rgb.g, rgb.b)
        var max = Math.max(rgb.r, rgb.g, rgb.b)
        var delta = max - min
        hsb.b = max
        hsb.s = max != 0 ? 255 * delta / max : 0
        if (hsb.s != 0) {
            if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta
            else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta
            else hsb.h = 4 + (rgb.r - rgb.g) / delta
        } else hsb.h = 0
        hsb.h *= 60
        if (hsb.h < 0) hsb.h += 360
        hsb.s *= 100/255
        hsb.b *= 100/255
        return hsb
    },

    math: (()=>{
        var math = require('mathjs/dist/math.min.js').create({
            matrix: 'Array'
        })
        math.import({
            unpack: function(a) { return Array.isArray(a) ? a.toString() : a },
            indexOf: function(a, x) { return a.indexOf(x) },
            pad: function(x, padding) {
                var str = String(x),
                    [int, dec] =  str.split('.')
                while (int.length < padding) {
                    int = '0' + int
                }
                return dec ? int + '.' + dec : int
            },
            length: function(x) { return x.length },
            values: function(x) { return Object.values(x) },
            keys: function(x) { return Object.keys(x) },
            extend: function(x, y) { return Object.assign(x, y) },
            timestamp: function() { return Date.now() },
            // basic relationnal to keep alphabetical string comparison (v4 change)
            equal:     function(a, b) { return a == b },
            unequal:   function(a, b) { return a != b },
            smaller:   function(a, b) { return a < b },
            larger:    function(a, b) { return a > b },
            smallerEq: function(a, b) { return a <= b },
            largerEq:  function(a, b) { return a >= b }
        }, {override:true})

        // set math's parser array index base to zero
        math.expression.mathWithTransform = Object.assign({}, math)

        return math
    })(),

    evaljs: (function(){

        var sandbox = document.createElement('iframe'),
            loopProtect = require('loop-protect')

        sandbox.style.display = 'none'
        sandbox.sandbox = 'allow-same-origin'
        document.documentElement.appendChild(sandbox)

        // block requests
        sandbox.contentWindow.document.open()
        sandbox.contentWindow.document.write('<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-eval\';">')
        sandbox.contentWindow.document.close()

        // init infinite loop guard
        loopProtect.alias = '__protect'
        loopProtect.hit = function(line){
            throw 'Potential infinite loop found on line ' + line
        }
        sandbox.contentWindow.__protect = loopProtect


        var _Function = sandbox.contentWindow.Function,
            parsers = {}

        sandbox.contentWindow.console = console
        sandbox.contentWindow.setTimeout =
        sandbox.contentWindow.setInterval = ()=>{
            throw 'setTimeout and setInterval can\'t be used in formulas'
        }
        sandbox.contentWindow.global = {}

        function nuke(o) {
            // non-primitives created outside the sandbox context can leak
            // the host window object... let's nuke that !
            // (we only nuke function and objects/arrays because we don't pass anything else)
            var t = typeof o
            if (t === 'function' || (t === 'object' && o !== null)) {
                if (o.__proto__) {
                    if (t === 'function') {
                        o.__proto__.constructor = _Function
                    } else {
                        o.__proto__.constructor.constructor = _Function
                    }
                }
                for (var k in o) {
                    nuke(o[k])
                }
            }
        }

        for (var imports of ['__protect', 'console', 'setTimeout', 'setInterval', 'global']) {
            nuke(sandbox.contentWindow[imports])
        }

        document.documentElement.removeChild(sandbox)

        function evaljs(code, defaultContext) {

            var contextInit = '',
                contextKeys = ['__VARS'],
                contextValues = [{}]

            if  (defaultContext) {
                for (var k in defaultContext) {
                    contextInit += `var ${k} = ${k} || ${JSON.stringify(defaultContext[k])};`
                    contextKeys.push(k)
                    contextValues.push(defaultContext[k])
                }
            }

            parsers[code] = new _Function(
                ...contextKeys,
                loopProtect('"use strict";' + contextInit + code)
                .replace(/;\n(if \(__protect.*break;)\n/g, ';$1') // prevent loop protect from breaking stack linenumber
                .replace(/(VAR_[0-9]+)/g, '__VARS.$1')
            )

            return (context)=>{

                var ret, err, k

                var __VARS = contextValues[0]
                for (k in context) {
                    var index = contextKeys.indexOf(k)
                    if (index !== -1) {
                        contextValues[index] = context[k]
                    } else {
                        __VARS[k] = context[k]
                    }
                }

                nuke(contextValues)

                // evaluate
                try {
                    ret = parsers[code].apply(null, contextValues)
                } catch(e) {
                    err = e
                }

                if (err) throw err

                return ret

            }

        }

        return evaljs

    })()

}
