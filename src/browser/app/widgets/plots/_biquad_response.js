//
// calcBiquad
//
// Dec 14, 2010 njr
// original @ Nigel Redmon

module.exports = function(options,linear,resolution) {
    var {type, freq, q, gain} = options,
        Fs = 44100,
        a0,a1,a2,b1,b2,norm,
        minVal, maxVal,
        len = resolution

    var V = Math.pow(10, Math.abs(gain) / 20)
    var K = Math.tan(Math.PI * freq / Fs)
    switch (type) {
        case 'lowpass':
            norm = 1 / (1 + K / q + K * K)
            a0 = K * K * norm
            a1 = 2 * a0
            a2 = a0
            b1 = 2 * (K * K - 1) * norm
            b2 = (1 - K / q + K * K) * norm
            break

        case 'highpass':
            norm = 1 / (1 + K / q + K * K)
            a0 = 1 * norm
            a1 = -2 * a0
            a2 = a0
            b1 = 2 * (K * K - 1) * norm
            b2 = (1 - K / q + K * K) * norm
            break

        case 'bandpass':
            norm = 1 / (1 + K / q + K * K)
            a0 = K / q * norm
            a1 = 0
            a2 = -a0
            b1 = 2 * (K * K - 1) * norm
            b2 = (1 - K / q + K * K) * norm
            break

        case 'notch':
            norm = 1 / (1 + K / q + K * K)
            a0 = (1 + K * K) * norm
            a1 = 2 * (K * K - 1) * norm
            a2 = a0
            b1 = a1
            b2 = (1 - K / q + K * K) * norm
            break

        case 'peak':
            if (gain >= 0) {
                norm = 1 / (1 + 1/q * K + K * K)
                a0 = (1 + V/q * K + K * K) * norm
                a1 = 2 * (K * K - 1) * norm
                a2 = (1 - V/q * K + K * K) * norm
                b1 = a1
                b2 = (1 - 1/q * K + K * K) * norm
            }
            else {
                norm = 1 / (1 + V/q * K + K * K)
                a0 = (1 + 1/q * K + K * K) * norm
                a1 = 2 * (K * K - 1) * norm
                a2 = (1 - 1/q * K + K * K) * norm
                b1 = a1
                b2 = (1 - V/q * K + K * K) * norm
            }
            break
        case 'lowshelf':
            if (gain >= 0) {
                norm = 1 / (1 + Math.SQRT2 * K + K * K)
                a0 = (1 + Math.sqrt(2*V) * K + V * K * K) * norm
                a1 = 2 * (V * K * K - 1) * norm
                a2 = (1 - Math.sqrt(2*V) * K + V * K * K) * norm
                b1 = 2 * (K * K - 1) * norm
                b2 = (1 - Math.SQRT2 * K + K * K) * norm
            }
            else {
                norm = 1 / (1 + Math.sqrt(2*V) * K + V * K * K)
                a0 = (1 + Math.SQRT2 * K + K * K) * norm
                a1 = 2 * (K * K - 1) * norm
                a2 = (1 - Math.SQRT2 * K + K * K) * norm
                b1 = 2 * (V * K * K - 1) * norm
                b2 = (1 - Math.sqrt(2*V) * K + V * K * K) * norm
            }
            break
        case 'highshelf':
            if (gain >= 0) {
                norm = 1 / (1 + Math.SQRT2 * K + K * K)
                a0 = (V + Math.sqrt(2*V) * K + K * K) * norm
                a1 = 2 * (K * K - V) * norm
                a2 = (V - Math.sqrt(2*V) * K + K * K) * norm
                b1 = 2 * (K * K - 1) * norm
                b2 = (1 - Math.SQRT2 * K + K * K) * norm
            }
            else {
                norm = 1 / (V + Math.sqrt(2*V) * K + K * K)
                a0 = (1 + Math.SQRT2 * K + K * K) * norm
                a1 = 2 * (K * K - 1) * norm
                a2 = (1 - Math.SQRT2 * K + K * K) * norm
                b1 = 2 * (K * K - V) * norm
                b2 = (V - Math.sqrt(2*V) * K + K * K) * norm
            }
            break
    }

    var magPlot = []
    for (var i = 0; i < len; i++) {
        var w, phi, y
        if (linear)
            w = i / (len - 1) * Math.PI    // 0 to pi, linear scale
        else
            w = Math.exp(Math.log(1 / 0.001) * i / (len - 1)) * 0.001 * Math.PI    // 0.001 to 1, times pi, log scale

        phi = Math.pow(Math.sin(w/2), 2)

        y = Math.log(Math.pow(a0+a1+a2, 2) - 4*(a0*a1 + 4*a0*a2 + a1*a2)*phi + 16*a0*a2*phi*phi) - Math.log(Math.pow(1+b1+b2, 2) - 4*(b1 + 4*b2 + b1*b2)*phi + 16*b2*phi*phi)
        y = y * 10 / Math.LN10
        if (y == -Infinity) y = -200

        if (linear)
            magPlot.push([i / (len - 1) * Fs / 2, y])
        else
            magPlot.push([i / (len - 1) * Fs / 2, y])

        if (i == 0)
            minVal = maxVal = y
        else if (y < minVal)
            minVal = y
        else if (y > maxVal)
            maxVal = y
    }

    return magPlot
}
