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

    }

}
