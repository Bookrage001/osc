
TABS = function(){
    var db = {'min': -70,'20%': -40,'45%': -20,'60%': -10,'71%':-6,'78%':-3,'85%':0,'92%':3,'max': 6}
    var target = '127.0.0.1:6666'
    var tabs = new Array()
    tabs.push(function(){
        var tab = {}
        tab.id = 'Audio Surface'
        tab.widgets = new Array()

        for (i in [0,1,2,3,4,5,6,7,8,9]) {
                tab.widgets.push({
                    id:'strip_'+i,
                    type:'strip',
                    widgets: [
                        {
                            id:'w0'+i,
                            type:"knob",
                            target:target
                        },
                        {
                            id:'w1'+i,
                            type:"switch",
                            values:['ozehfozeizadz',1,2],
                            target:target
                        },
                        {
                            id:'w2'+i,
                            type:"fader",
                            target:target
                        },
                        {
                            id:'w3'+i,
                            type:"toggle",
                            mode:"horizontal",
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
