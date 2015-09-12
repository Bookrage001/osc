nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}
nmRange = {'min': -70,'20%': -40,'45%': -20,'60%': -10,'71%':-6,'78%':-3,'85%':0,'92%':3,'max': 6}

TABS = [
    {
        id:'MonitorsDag',
        widgets: [

            {
			    id:'Drums',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Drums/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Basses',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Basses/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Guitars',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'MxDrums',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'MxSynths',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Vocals',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'BassDag',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/BassDag/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'GuitarDag',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/GuitarDag/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'VoixDag',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/VoixDag/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Metronome',
			    range:nmRange,
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)/unscaled'
            },

            {
			    id:'MonitorsDag',
			    range:nmRange,
			    target:nmPorts['Mains'],
			    path:'/strip/MonitorsDag/Gain/Gain%20(dB)/unscaled',
			    color:'accent'
            }
        ]
    }
]
