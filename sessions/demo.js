(function(){
    var db = {'min': -70,'20%': -40,'45%': -20,'60%': -10,'71%':-6,'78%':-3,'85%':0,'92%':3,'max': 6}
    var target = '127.0.0.1:6666'
    var tabs = new Array()
    tabs.push(function(){
        var tab = {}
        tab.widgets = new Array()
        for (i in [0,1,2,3,4,5,6,7,8,9]) {
                tab.widgets.push({
                    type:'strip',
                    widgets: [
                        {
                            label:false,
                            type:"knob",
                            target:target
                        },
                        {
                            label:false,
                            type:"switch",
                            values:[0,1,2],
                            target:target
                        },
                        {
                            label:false,
                            type:"fader",
                            range:db,
                            target:target,
                        },
                        {
                            label:'Mute',
                            type:"toggle",
                            target:target
                            // color:'orange'
                        }
                    ]

                })

        }
        return tab
    }())

    tabs.push(function(){
        var tab = {}
        tab.widgets = new Array()
        for (i in [0,1,2,3,4,5]) {
                tab.widgets.push({
                    type:'strip',
                    width:200,
                    widgets: [
                        {
                            label:'Absolute XY',
                            type:"rgb",
                            absolute:true,
                            target:target
                        },
                        {
                            label:'Relative XY',
                            type:"xy",
                            target:target
                        }
                    ]

                })

        }
        return tab
    }())

    return tabs
})()
