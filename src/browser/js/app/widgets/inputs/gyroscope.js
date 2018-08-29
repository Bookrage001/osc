var Widget = require('../common/widget'),
    GyroNorm = require('gyronorm/dist/gyronorm.complete.min.js'),
    {iconify} = require('../../ui/utils'),
    {clip} = require('../utils')

class Gyroscope extends Widget {

    static defaults() {

        return {
            type:'gyroscope',
            id:'auto',
            linkId:'',

            _geometry:'geometry',

            left:'auto',
            top:'auto',
            width:'auto',
            height:'auto',

            _style:'style',

            label:'auto',
            color:'auto',
            css:'',

            _gyroscope: 'gyroscope',

            frequency: 30,
            normalize: true,
            compass: false,
            screenAdjusted: false,
            precision: 2

        }

    }

    constructor(options) {

        var html = `
            <div class="gyroscope">
                ${iconify('^arrows-alt')}
            </div>
        `

        super({...options, html: html})

        this.sensor = new GyroNorm()
        this.sensor.init({

            frequency: 1000 / clip(this.getProp('frequency'), [0.01, 60]),
            gravityNormalized: this.getProp('normalize'),
            orientationBase: this.getProp('compass') ? GyroNorm.WORLD : GyroNorm.GAME,
            decimalCount: this.getProp('precision'),
            screenAdjusted: this.getProp('screenAdjusted'),
            logger: null

        }).then(()=>{

            this.sensor.start((data)=>{

                this.setValue(data, {sync: true})

                // data.do.alpha       ( deviceorientation event alpha value )
                // data.do.beta        ( deviceorientation event beta value )
                // data.do.gamma       ( deviceorientation event gamma value )
                // data.do.absolute    ( deviceorientation event absolute value )

                // data.dm.x        ( devicemotion event acceleration x value )
                // data.dm.y        ( devicemotion event acceleration y value )
                // data.dm.z        ( devicemotion event acceleration z value )

                // data.dm.gx        ( devicemotion event accelerationIncludingGravity x value )
                // data.dm.gy        ( devicemotion event accelerationIncludingGravity y value )
                // data.dm.gz        ( devicemotion event accelerationIncludingGravity z value )

                // data.dm.alpha    ( devicemotion event rotationRate alpha value )
                // data.dm.beta     ( devicemotion event rotationRate beta value )
                // data.dm.gamma    ( devicemotion event rotationRate gamma value )


            })

        }).catch((e)=>{

            console.log(e)

        })

    }



    setValue(v, options={} ) {

        this.value = v

        // if (options.send) this.sendValue()
        if (options.sync) this.changed(options)

    }

    onRemove() {

        this.sensor.end()

        super.onRemove()

    }


}

module.exports = Gyroscope
