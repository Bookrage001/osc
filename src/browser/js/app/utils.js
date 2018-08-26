module.exports = {

    deepCopy: function(obj, precision) {

        var copy = obj

        if (obj === null) {
            return obj
        }

        if (typeof obj === 'object') {
            copy = Array.isArray(obj) ? [] : {}
            for (let key in obj) {
                copy[key] = module.exports.deepCopy(obj[key], precision)
            }
        } else if (typeof obj == 'number') {
            return precision === undefined ? copy : parseFloat(copy.toFixed(precision))
        }

        return copy

    },

    deepEqual: function(a, b) {

        // about 2,75 x faster than JSON.stringify(a) === JSON.stringify(b)

        var ta = typeof a,
            tb = typeof b

        if (ta !== tb) {
            return false
        } else if (ta === 'object') {
            return JSON.stringify(a) === JSON.stringify(b)
        } else {
            return a === b
        }

    }

}
