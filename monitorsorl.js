nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

TABS = {
    MonitorsORL:{
        title: 'Monitor ORL',
        
        strips: {
		

            moDrums: {
			    title:'Drums',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Drums/Gain/Gain%20(dB)/unscaled'
		    },

            moBasses: {
			    title:'Basses',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Basses/Gain/Gain%20(dB)/unscaled'
		    },

            moGuitars: {
			    title:'Guitars',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled'
		    },

            moMxDrums: {
			    title:'MxDrums',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled'
		    },

            moMxSynths: {
			    title:'MxSynths',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled'
		    },

            moVocals: {
			    title:'Vocals',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled'
		    },

            moBassORL: {
			    title:'BassORL',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/BassORL/Gain/Gain%20(dB)/unscaled'
		    },

            moGuitarORL: {
			    title:'GuitarORL',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/GuitarORL/Gain/Gain%20(dB)/unscaled'
		    },

            moVxORL: {
			    title:'VxORL',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/VxORL/Gain/Gain%20(dB)/unscaled'
		    },

            moMetronome: {
			    title:'Metronome',
			    range:'db',
			    target:nmPorts['MonitorsORL'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)/unscaled'
		    },
            MonitorsORL: {
		        title:'MonitorsORL',
		        range:'db',
		        target:nmPorts['Mains'],
		        path:'/strip/MonitorsORL/Gain/Gain%20(dB)/unscaled',
		        color:'#777'
            } 
        }
    }
}
