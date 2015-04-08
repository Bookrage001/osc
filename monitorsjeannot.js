nmPorts = {
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

TABS = {
    MonitorsJeannot:{
        title: 'Monitor Jeannot',
        
        strips: {
		

            mjDrums: {
			    title:'Drums',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Drums/Gain/Gain%20(dB)'
		    },

            mjBasses: {
			    title:'Basses',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Basses/Gain/Gain%20(dB)'
		    },

            mjGuitars: {
			    title:'Guitars',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Guitars/Gain/Gain%20(dB)'
		    },

            mjMxDrums: {
			    title:'MxDrums',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/MxDrums/Gain/Gain%20(dB)'
		    },

            mjMxSynths: {
			    title:'MxSynths',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/MxSynths/Gain/Gain%20(dB)'
		    },

            mjVocals: {
			    title:'Vocals',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Vocals/Gain/Gain%20(dB)'
		    },

            mjMetronome: {
			    title:'Metronome',
			    range:'db',
			    target:nmPorts['MonitorsJeannot'],
			    path:'/strip/Metronome/Gain/Gain%20(dB)'
            },

            MonitorsJeannot: {
			    title:'MonitorsJeannot',
			    range:'db',
			    target:nmPorts['Mains'],
			    path:'/strip/MonitorsJeannot/Gain/Gain%20(dB)',
			    color:'#777'
            } 
        }
    }
}
