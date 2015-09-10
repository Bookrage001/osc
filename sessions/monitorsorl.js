nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

TABS =  [
    {
        id: 'MonitorORL',
        widgets : [

            {
			    id:'Drums',
                type:'fader',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Drums/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Basses',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Basses/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Guitars',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'MxDrums',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'MxSynths',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Vocals',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'BassORL',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/BassORL/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'GuitarORL',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/GuitarORL/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'VxORL',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/VxORL/Gain/Gain%20(dB)/unscaled'
		    },

            {
			    id:'Metronome',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)/unscaled'
		    },
            {
		        id:'MonitorsORL',
		        range:'db',
		        target:nmPorts['Mains'],
		        path:'/strip/MonitorsORL/Gain/Gain%20(dB)/unscaled',
		        color:'accent'
            }
        ]
    }
]
