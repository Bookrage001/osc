
TABS = function(){
    var db = {'min': -70,'20%': -40,'45%': -20,'60%': -10,'71%':-6,'78%':-3,'85%':0,'92%':3,'max': 6}
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
                            id:'knob_'+i,
                            type:"knob"
                        },
                        {
                            id:'fader_'+i,
                            type:"fader",
                            range:db
                        },
                        {
                            id:'toggle1_'+i,
                            label:'Mute',
                            type:"toggle",
                            // color:'orange'
                        }
                    ]

                })


        }




        return tab
    }())


    return tabs
}()
console.log(TABS)
