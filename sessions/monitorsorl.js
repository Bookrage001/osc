(function(){
nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

nmRange = {'min': -70,'20%': -40,'45%': -20,'60%': -10,'71%':-6,'78%':-3,'85%':0,'92%':3,'max': 6}


return  [
    {
        id: 'MonitorORL',
        widgets : [

            {
			    id:'Drums',
                type:'fader',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Drums/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Basses',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Basses/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Guitars',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'MxDrums',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'MxSynths',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Vocals',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'BassORL',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/BassORL/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'GuitarORL',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/GuitarORL/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'VxORL',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/VxORL/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Metronome',
			    range:nmRange,
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)/unscaled'
		    },
            {
		        id:'MonitorsORL',
		        range:nmRange,
		        target:nmPorts['Mains'],
		        path:'/strip/MonitorsORL/Gain/Gain%20(dB)/unscaled',
		        color:'accent'
            }
        ]
    }
]
})()
