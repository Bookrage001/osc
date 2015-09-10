nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

TABS = [
    {
        id:'MonitorsDag',
        widgets: [

            {
			    id:'Drums',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Drums/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Basses',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Basses/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Guitars',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'MxDrums',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'MxSynths',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Vocals',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'BassDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/BassDag/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'GuitarDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/GuitarDag/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'VoixDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/VoixDag/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Metronome',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)/unscaled'
            },

            {
			    id:'MonitorsDag',
			    range:'db',
			    target:nmPorts['Mains'],
			    path:'/strip/MonitorsDag/Gain/Gain%20(dB)/unscaled',
			    color:'accent'
            }
        ]
    }
]
