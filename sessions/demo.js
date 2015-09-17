
TABS = function(){
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
                            type:"knob",
                            target:target
                        },
                        {
                            type:"switch",
                            values:[0,1,2],
                            target:target
                        },
                        {
                            type:"fader",
                            target:target
                        },
                        {
                            type:"toggle",
                            target:target
                            // color:'orange'
                        }
                    ]

                })


        }




        return tab
    }())
tabs.push({id:'test'})

    return tabs
}()
