nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

TABS = {
    MonitorsDag:{
        title: 'Monitor Dag-Z',
        
        strips: {

            mdDrums: {
			    title:'Drums',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Drums/Gain/Gain%20(dB)'
		    },

            mdBasses: {
			    title:'Basses',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Basses/Gain/Gain%20(dB)'
		    },

            mdGuitars: {
			    title:'Guitars',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)'
		    },

            mdMxDrums: {
			    title:'MxDrums',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)'
		    },

            mdMxSynths: {
			    title:'MxSynths',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)'
		    },

            mdVocals: {
			    title:'Vocals',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)'
		    },

            mdBassDag: {
			    title:'BassDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/BassDag/Gain/Gain%20(dB)'
		    },

            mdGuitarDag: {
			    title:'GuitarDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/GuitarDag/Gain/Gain%20(dB)'
		    },

            mdVoixDag: {
			    title:'VoixDag',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/VoixDag/Gain/Gain%20(dB)'
		    },

            mdMetronome: {
			    title:'Metronome',
			    range:'db',
			    target:nmPorts['MonitorsDag'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)'
            },
            
            MonitorsDag: {
			    title:'MonitorsDag',
			    range:'db',
			    target:nmPorts['Mains'],
			    path:'/strip/MonitorsDag/Gain/Gain%20(dB)',
			    color:'#777'
            }   
        }
    } 
}

