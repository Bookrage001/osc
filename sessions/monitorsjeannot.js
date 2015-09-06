nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

TABS = {
    MonitorsJeannot:{
        title: 'Monitor Jeannot',
        
        widgets: {
		

            mjDrums: {
			    title:'Drums',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Drums/Gain/Gain%20(dB)/unscaled'
		    },

            mjBasses: {
			    title:'Basses',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Basses/Gain/Gain%20(dB)/unscaled'
		    },

            mjGuitars: {
			    title:'Guitars',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled'
		    },

            mjMxDrums: {
			    title:'MxDrums',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled'
		    },

            mjMxSynths: {
			    title:'MxSynths',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled'
		    },

            mjVocals: {
			    title:'Vocals',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled'
		    },

            mjMetronome: {
			    title:'Metronome',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)/unscaled'
            },

            MonitorsJeannot: {
			    title:'MonitorsJeannot',
			    range:'db',
			    target:nmPorts['Mains'],
			    path:'/strip/MonitorsJeannot/Gain/Gain%20(dB)/unscaled',
			    color:'#777'
            } 
        }
    }
}
