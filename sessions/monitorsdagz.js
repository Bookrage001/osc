nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

TABS = {
    MonitorsDag:{
        title: 'Monitor Dag-Z',
        
        widgets: {

            mdDrums: {
			    title:'Drums',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Drums/Gain/Gain%20(dB)/unscaled'
		    },

            mdBasses: {
			    title:'Basses',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Basses/Gain/Gain%20(dB)/unscaled'
		    },

            mdGuitars: {
			    title:'Guitars',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled'
		    },

            mdMxDrums: {
			    title:'MxDrums',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled'
		    },

            mdMxSynths: {
			    title:'MxSynths',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled'
		    },

            mdVocals: {
			    title:'Vocals',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled'
		    },

            mdBassDag: {
			    title:'BassDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/BassDag/Gain/Gain%20(dB)/unscaled'
		    },

            mdGuitarDag: {
			    title:'GuitarDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/GuitarDag/Gain/Gain%20(dB)/unscaled'
		    },

            mdVoixDag: {
			    title:'VoixDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/VoixDag/Gain/Gain%20(dB)/unscaled'
		    },

            mdMetronome: {
			    title:'Metronome',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)/unscaled'
            },
            
            MonitorsDag: {
			    title:'MonitorsDag',
			    range:'db',
			    target:nmPorts['Mains'],
			    path:'/strip/MonitorsDag/Gain/Gain%20(dB)/unscaled',
			    color:'#777'
            }   
        }
    } 
}

