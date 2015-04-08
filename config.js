nmPorts = {
    'MainMix':'localhost:6666',
    'Drums':'SCSon:6667',
    'Basses':'SCSon:6668',
    'Guitars':'SCSon:6669',
    'MxSynths':'SCSon:6670',
    'MxDrums':'SCSon:6671',
    'Vocals':'SCSon:6672',
    'Toms':'SCSon:6673',
    'Acoustics':'SCSon:6674',
    'MonitorsDag':'SCSon:6675',
    'MonitorsJeannot':'SCSon:6676',
    'MonitorsORL':'SCSon:6677',
    'Mains':'SCSon:6678',
}

TABS = {
    
    MainMix: {
    
        title:'MainMix',
        strips:{
	
            Drums: {
	            title:'Drums',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Drums/Gain/Gain%20(dB)/unscaled'
            },
                
            Basses: {
	            title:'Basses',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Basses/Gain/Gain%20(dB)/unscaled'
            },
                
            Guitars: {
	            title:'Guitars',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled'
            },
                
            MxSynths: {
	            title:'MxSynths',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled'
            },
                
            MxDrums: {
	            title:'MxDrums',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled'
            },
              
            Vocals: {
	            title:'Vocals',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled'
            },
               
            Acoustics: {
	            title:'Acoustics',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Acoustics/Gain/Gain%20(dB)/unscaled'
            },
                
            FOH: {
	            title:'FOH',
	            range:'db',
	            target:nmPorts['Mains'],
	            path:'/strip/FOH/Gain/Gain%20(dB)/unscaled',
	            color:'#777'
            }
        }
    },

    Drums: {
        title:'Drums',
        tabs:{
            Drumset: {
                title:'Drumset',
                strips: {
                    Kick: {
	                    title:'Kick',
	                    range:'db',
	                    target:nmPorts['Drums'],
	                    path:'/strip/Kick/Gain/Gain%20(dB)/unscaled'
                    },
                          
                    Snare: {
	                    title:'Snare',
	                    range:'db',
	                    target:nmPorts['Drums'],
	                    path:'/strip/Snare/Gain/Gain%20(dB)/unscaled'
                    },
                            
                    Toms: {
	                    title:'Toms',
	                    range:'db',
	                    target:nmPorts['Drums'],
	                    path:'/strip/Toms/Gain/Gain%20(dB)/unscaled'
                    },
                            
                    OH_L: {
	                    title:'OH-L',
	                    range:'db',
	                    target:nmPorts['Drums'],
	                    path:'/strip/OH-L/Gain/Gain%20(dB)/unscaled'
                    },
                            
                    OH_R: {
	                    title:'OH-R',
	                    range:'db',
	                    target:nmPorts['Drums'],
	                    path:'/strip/OH-R/Gain/Gain%20(dB)/unscaled'
                
                    },
                    Drums: {
	                    title:'Drums',
	                    range:'db',
	                    target:nmPorts['MainMix'],
	                    path:'/strip/Drums/Gain/Gain%20(dB)/unscaled',
	                    color:'#777'
                    }
                },
                
            },
            
            Toms: {
                strips:{
                    Tom1: {
	                    title:'Tom1',
	                    range:'db',
	                    target:nmPorts['Toms'],
	                    path:'/strip/Tom1/Gain/Gain%20(dB)/unscaled'
                    },
                            
                    Tom2: {
	                    title:'Tom2',
	                    range:'db',
	                    target:nmPorts['Toms'],
	                    path:'/strip/Tom2/Gain/Gain%20(dB)/unscaled'
                    },
                                
                    Tom3: {
	                    title:'Tom3',
	                    range:'db',
	                    target:nmPorts['Toms'],
	                    path:'/strip/Tom3/Gain/Gain%20(dB)/unscaled'
                    },
                    Toms: {
	                    title:'Toms',
	                    range:'db',
	                    target:nmPorts['Drums'],
	                    path:'/strip/Toms/Gain/Gain%20(dB)/unscaled',
	                    color:'#777'
                    }
                }
            }
        }
    },
    
    Basses: {
        title:'Basses',
        strips:{

            Bass_ORL: {
	            title:'Bass_ORL',
	            range:'db',
	            target:nmPorts['Basses'],
	            path:'/strip/Bass_ORL/Gain/Gain%20(dB)/unscaled'
            },
                   
            Oct_Bass_ORL: {
	            title:'Oct_Bass_ORL',
	            range:'db',
	            target:nmPorts['Basses'],
	            path:'/strip/Oct_Bass_ORL/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Bass_ORL: {
	            title:'FX_Bass_ORL',
	            range:'db',
	            target:nmPorts['Basses'],
	            path:'/strip/FX_Bass_ORL/Gain/Gain%20(dB)/unscaled'
            },
                    
            Bass_Dag: {
	            title:'Bass_Dag',
	            range:'db',
	            target:nmPorts['Basses'],
	            path:'/strip/Bass_Dag/Gain/Gain%20(dB)/unscaled'
            },
                    
            Oct_Bass_Dag: {
	            title:'Oct_Bass_Dag',
	            range:'db',
	            target:nmPorts['Basses'],
	            path:'/strip/Oct_Bass_Dag/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Bass_Dag: {
	            title:'FX_Bass_Dag',
	            range:'db',
	            target:nmPorts['Basses'],
	            path:'/strip/FX_Bass_Dag/Gain/Gain%20(dB)/unscaled'
            },
            Basses: {
	            title:'Basses',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Basses/Gain/Gain%20(dB)/unscaled',
	            color:'#777'
            }
                
        }
    },
    
    Guitars: {
        title:'Guitars',
        strips:{
                    
            Guitar_ORL: {
	            title:'Guitar_ORL',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/Guitar_ORL/Gain/Gain%20(dB)/unscaled'
            },
                   
            FX_Gtr_ORL_1: {
	            title:'FX_Gtr_ORL_1',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/FX_Gtr_ORL_1/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Gtr_ORL_2: {
	            title:'FX_Gtr_ORL_2',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/FX_Gtr_ORL_2/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Gtr_ORL: {
	            title:'FX_Gtr_ORL',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/FX_Gtr_ORL/Gain/Gain%20(dB)/unscaled'
            },
                    
            Guitar_Dag: {
	            title:'Guitar_Dag',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/Guitar_Dag/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Gtr_Dag_1: {
	            title:'FX_Gtr_Dag_1',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/FX_Gtr_Dag_1/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Gtr_Dag_2: {
	            title:'FX_Gtr_Dag_2',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/FX_Gtr_Dag_2/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Gtr_Dag: {
	            title:'FX_Gtr_Dag',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/FX_Gtr_Dag/Gain/Gain%20(dB)/unscaled'
            },
                    
            Scape_Gtr_Dag: {
	            title:'Scape_Gtr_Dag',
	            range:'db',
	            target:nmPorts['Guitars'],
	            path:'/strip/Scape_Gtr_Dag/Gain/Gain%20(dB)/unscaled'
            },
            Guitars: {
	            title:'Guitars',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Guitars/Gain/Gain%20(dB)/unscaled',
	            color:'#777'
            }
        }
    },
        
    MxSynths: {
        title:'MxSynths',
        strips:{
	
            MxBass: {
	            title:'MxBass',
	            range:'db',
	            target:nmPorts['MxSynths'],
	            path:'/strip/MxBass/Gain/Gain%20(dB)/unscaled'
            },
                  
            MxChords: {
	            title:'MxChords',
	            range:'db',
	            target:nmPorts['MxSynths'],
	            path:'/strip/MxChords/Gain/Gain%20(dB)/unscaled'
            },
                    
            MxLead: {
	            title:'MxLead',
	            range:'db',
	            target:nmPorts['MxSynths'],
	            path:'/strip/MxLead/Gain/Gain%20(dB)/unscaled'
            },
                    
            MxCtLead: {
	            title:'MxCtLead',
	            range:'db',
	            target:nmPorts['MxSynths'],
	            path:'/strip/MxCtLead/Gain/Gain%20(dB)/unscaled'
            },        
            
            MxClassical: {
	            title:'MxClassical',
	            range:'db',
	            target:nmPorts['MxSynths'],
	            path:'/strip/MxClassical/Gain/Gain%20(dB)/unscaled'
            },
            MxSynths: {
	            title:'MxSynths',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/MxSynths/Gain/Gain%20(dB)/unscaled',
                color:'#777'
            }
        }
    },
    
    MxDrums: {
        title:'MxDrums',
        strips:{
	    
            MxKicks: {
	            title:'MxKicks',
	            range:'db',
	            target:nmPorts['MxDrums'],
	            path:'/strip/MxKicks/Gain/Gain%20(dB)/unscaled'
            },
                   
            MxSnares: {
	            title:'MxSnares',
	            range:'db',
	            target:nmPorts['MxDrums'],
	            path:'/strip/MxSnares/Gain/Gain%20(dB)/unscaled'
            },
                    
            MxCymbs: {
	            title:'MxCymbs',
	            range:'db',
	            target:nmPorts['MxDrums'],
	            path:'/strip/MxCymbs/Gain/Gain%20(dB)/unscaled'
            },
                    
            MxCont: {
	            title:'MxCont',
	            range:'db',
	            target:nmPorts['MxDrums'],
	            path:'/strip/MxCont/Gain/Gain%20(dB)/unscaled'
            },
                    
            MxSamples: {
	            title:'MxSamples',
	            range:'db',
	            target:nmPorts['MxDrums'],
	            path:'/strip/MxSamples/Gain/Gain%20(dB)/unscaled'
            },
            MxDrums: {
	            title:'MxDrums',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/MxDrums/Gain/Gain%20(dB)/unscaled',
	            color:'#777'
            },
        }
    },
            
    Acoustics: {
        title:'Acoustics',
        strips:{
	
            PianoToy: {
	            title:'PianoToy',
	            range:'db',
	            target:nmPorts['Acoustics'],
	            path:'/strip/PianoToy/Gain/Gain%20(dB)/unscaled'
            },
                   
            Cymbalum: {
	            title:'Cymbalum',
	            range:'db',
	            target:nmPorts['Acoustics'],
	            path:'/strip/Cymbalum/Gain/Gain%20(dB)/unscaled'
            },
                    
            GuitarAc: {
	            title:'GuitarAc',
	            range:'db',
	            target:nmPorts['Acoustics'],
	            path:'/strip/GuitarAc/Gain/Gain%20(dB)/unscaled'
            },
            Acoustics: {
	            title:'Acoustics',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Acoustics/Gain/Gain%20(dB)/unscaled',
	            color:'#777'
            }
        }
    },
    
    Vocals: {
        title:'Vocals',
        strips:{
        
            Vx_ORL: {
	            title:'Vx_ORL',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/Vx_ORL/Gain/Gain%20(dB)/unscaled'
            },
                   
            FX_Vx_ORL_1: {
	            title:'FX_Vx_ORL_1',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/FX_Vx_ORL_1/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Vx_ORL_2: {
	            title:'FX_Vx_ORL_2',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/FX_Vx_ORL_2/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Vx_ORL: {
	            title:'FX_Vx_ORL',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/FX_Vx_ORL/Gain/Gain%20(dB)/unscaled'
            },
                    
            Vx_Dag: {
	            title:'Vx_Dag',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/Vx_Dag/Gain/Gain%20(dB)/unscaled'
            },
                    
            FX_Vx_Dag_1: {
	            title:'FX_Vx_Dag_1',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/FX_Vx_Dag_1/Gain/Gain%20(dB)/unscaled'
            },        
            
            FX_Vx_Dag_2: {
	            title:'FX_Vx_Dag_2',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/FX_Vx_Dag_2/Gain/Gain%20(dB)/unscaled'
            },        
            
            FX_Vx_Dag: {
	            title:'FX_Vx_Dag',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/FX_Vx_Dag/Gain/Gain%20(dB)/unscaled'
            },
                    
            Scape_Vx_Dag: {
	            title:'Scape_Vx_Dag',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/Scape_Vx_Dag/Gain/Gain%20(dB)/unscaled'
            },
                    
            Vx_Jeannot: {
	            title:'Vx_Jeannot',
	            range:'db',
	            target:nmPorts['Vocals'],
	            path:'/strip/Vx_Jeannot/Gain/Gain%20(dB)/unscaled'
            },
            Vocals: {
	            title:'Vocals',
	            range:'db',
	            target:nmPorts['MainMix'],
	            path:'/strip/Vocals/Gain/Gain%20(dB)/unscaled',
	            color:'#777'
            }
        }
    }
}
