nmPorts = {
    'MainMix':'SCSon:6666',
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
        widgets:{
	
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
                widgets: {
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
                widgets:{
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
            },
            
            EQs: {
                tabs: {
                    EQ_Drums: {
                        title:'Drumset',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Drums: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Drums: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Drums: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Drums: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Drums: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Drums: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Drums: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Drums: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Drums: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Drums: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Drums: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Drums: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Drums: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Drums: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Drums: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Drums: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Drums/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_Kick: {
                        title:'Kick',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Kick: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Kick: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Kick: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Kick: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Kick: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Kick: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Kick: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Kick: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Kick: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Kick: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Kick: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Kick: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Kick: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Kick: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Kick: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Kick: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Kick/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_Snare: {
                        title:'Snare',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Snare: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Snare: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Snare: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Snare: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Snare: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Snare: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Snare: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Snare: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Snare: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Snare: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Snare: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Snare: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Snare: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Snare: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Snare: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Snare: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Snare/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_Tom1: {
                        title:'Tom 1',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Tom1: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Tom1: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Tom1: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Tom1: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Tom1: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Tom1: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Tom1: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Tom1: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Tom1: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Tom1: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Tom1: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Tom1: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Tom1: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Tom1: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Tom1: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Tom1: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom1/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_Tom2: {
                        title:'Tom 2',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Tom2: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Tom2: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Tom2: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Tom2: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Tom2: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Tom2: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Tom2: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Tom2: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Tom2: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Tom2: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Tom2: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Tom2: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Tom2: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Tom2: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Tom2: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Tom2: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom2/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_Tom3: {
                        title:'Tom 3',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Tom3: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Tom3: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Tom3: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Tom3: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Tom3: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Tom3: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Tom3: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Tom3: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Tom3: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Tom3: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Tom3: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Tom3: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Tom3: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Tom3: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Tom3: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Tom3: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/Tom3/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_OH_L: {
                        title:'OH-L (ride)',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_OH_L: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_OH_L: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_OH_L: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_OH_L: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_OH_L: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_OH_L: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_OH_L: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_OH_L: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_OH_L: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_OH_L: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_OH_L: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_OH_L: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_OH_L: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_OH_L: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_OH_L: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_OH_L: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-L/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_OH_R: {
                        title:'OH-R (hihat)',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_OH_R: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_OH_R: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_OH_R: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_OH_R: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_OH_R: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_OH_R: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_OH_R: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_OH_R: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_OH_R: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_OH_R: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_OH_R: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_OH_R: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_OH_R: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_OH_R: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_OH_R: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_OH_R: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Drums'],
                                        path:'/strip/OH-R/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                }
            }
        }
    },
    
    Basses: {
        title:'Basses',
        tabs:{
            Main: {
                widgets: {
                    Bass_ORL: {
	                    title:'Bass Orl',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/Bass_ORL/Gain/Gain%20(dB)/unscaled'
                    },
                    Bass_Dag: {
	                    title:'Bass Dag',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/Bass_Dag/Gain/Gain%20(dB)/unscaled'
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
            Orl: {
                widgets:{
                    Oct_Bass_ORL: {
	                    title:'Octaver',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/Oct_Bass_ORL/Gain/Gain%20(dB)/unscaled'
                    },
                    Disto_Bass_ORL: {
	                    title:'Disto',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/Disto_Bass_ORL/Gain/Gain%20(dB)/unscaled'
                    },   
                    FX_Bass_ORL: {
	                    title:'Fx',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/FX_Bass_ORL/Gain/Gain%20(dB)/unscaled'
                    },
                    Bass_ORL: {
	                    title:'Basse Orl',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/Bass_ORL/Gain/Gain%20(dB)/unscaled',
	                    color:'#777'
                    }
                }
            
            },
            Dag: {
                widgets:{
                    Oct_Bass_Dag: {
	                    title:'Octaver',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/Oct_Bass_Dag/Gain/Gain%20(dB)/unscaled'
                    },
                    Disto_Bass_Dag: {
	                    title:'Disto',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/Disto_Bass_Dag/Gain/Gain%20(dB)/unscaled'
                    },   
                    FX_Bass_Dag: {
	                    title:'Fx',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/FX_Bass_Dag/Gain/Gain%20(dB)/unscaled'
                    },
                    Bass_Dag: {
	                    title:'Basse Dag',
	                    range:'db',
	                    target:nmPorts['Basses'],
	                    path:'/strip/Bass_Dag/Gain/Gain%20(dB)/unscaled',
	                    color:'#777'
                    }
                }
            },       
            EQs: {
                tabs: {
                    EQ_Bass_Dag: {
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Bass_Dag: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Bass_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Bass_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Bass_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Bass_Dag: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Bass_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Bass_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Bass_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Bass_Dag: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Bass_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Bass_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Bass_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Bass_Dag: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Bass_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Bass_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Bass_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Basses'],
                                        path:'/strip/Bass_Dag/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },        
                
                }
            }      
        },
    },
    
    Guitars: {
        title:'Guitars',
        widgets:{
                    
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
        tabs: {
            Main:{
               widgets:{

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
            EQs: {
                tabs: {
                    EQ_MxBass: {
                        title:'MxBass',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_MxBass: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_MxBass: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_MxBass: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_MxBass: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_MxBass: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_MxBass: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_MxBass: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_MxBass: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_MxBass: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_MxBass: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_MxBass: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_MxBass: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_MxBass: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_MxBass: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_MxBass: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_MxBass: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxSynths'],
                                        path:'/strip/MxBass/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                }
            }
        }
    },
    
    MxDrums: {
        title:'MxDrums',
        tabs: {
            Main: {
                widgets:{
	            
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
            EQs: {
                tabs: {
                    EQ_MxKicks: {
                        title:'MxKicks',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_MxKicks: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_MxKicks: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_MxKicks: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_MxKicks: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_MxKicks: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_MxKicks: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_MxKicks: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_MxKicks: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_MxKicks: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_MxKicks: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_MxKicks: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_MxKicks: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_MxKicks: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_MxKicks: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_MxKicks: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_MxKicks: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxKicks/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_MxCymbs: {
                        title:'MxCymbs',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_MxCymbs: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_MxCymbs: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_MxCymbs: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_MxCymbs: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_MxCymbs: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_MxCymbs: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_MxCymbs: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_MxCymbs: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_MxCymbs: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_MxCymbs: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_MxCymbs: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_MxCymbs: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_MxCymbs: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_MxCymbs: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_MxCymbs: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_MxCymbs: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['MxDrums'],
                                        path:'/strip/MxCymbs/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                }
            }
        }

    },
            
    Acoustics: {
        title:'Acoustics',
        widgets:{
	
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
        tabs: {
            Main: {
                widgets:{
                
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
            },
            
            EQs: {
                tabs: {
                    EQ_Vx_ORL: {
                        title:'ORL',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Vx_ORL: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Vx_ORL: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Vx_ORL: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Vx_ORL: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Vx_ORL: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Vx_ORL: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Vx_ORL: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Vx_ORL: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Vx_ORL: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Vx_ORL: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Vx_ORL: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Vx_ORL: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Vx_ORL: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Vx_ORL: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Vx_ORL: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Vx_ORL: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_ORL/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_Vx_Dag: {
                        title:'Dag',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Vx_Dag: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Vx_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Vx_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Vx_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Vx_Dag: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Vx_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Vx_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Vx_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Vx_Dag: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Vx_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Vx_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Vx_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Vx_Dag: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Vx_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Vx_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Vx_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Vx_Dag/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                    EQ_Scape_Vx_Dag: {
                        title:'Scape Dag',
                        widgets: {
                            EQ_1: {
                                type:'stack',
                                title: 'Band 1',
                                widgets: {
                                    EQ_Freq_1_Scape_Vx_Dag: {
                                        title:'Frequency',
                                        range:{'min':20,'max':2000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Frequency%201'
                                    },
                                    EQ_Band_1_Scape_Vx_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Bandwidth%201'
                                    },
                                    EQ_Gain_1_Scape_Vx_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Gain%201'
                                    },
                                    EQ_On_1_Scape_Vx_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Section%201'
                                    }
                                }
                            },
                            EQ_2: {
                                type:'stack',
                                title: 'Band 2',
                                widgets: {
                                    EQ_Freq_2_Scape_Vx_Dag: {
                                        title:'Frequency',
                                        range:{'min':40,'max':4000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Frequency%202'
                                    },
                                    EQ_Band_2_Scape_Vx_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Bandwidth%202'
                                    },
                                    EQ_Gain_2_Scape_Vx_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Gain%202'
                                    },
                                    EQ_On_2_Scape_Vx_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Section%202'
                                    }
                                }
                            },
                            EQ_3: {
                                type:'stack',
                                title: 'Band 3',
                                widgets: {
                                    EQ_Freq_3_Scape_Vx_Dag: {
                                        title:'Frequency',
                                        range:{'min':100,'max':10000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Frequency%203'
                                    },
                                    EQ_Band_3_Scape_Vx_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Bandwidth%203'
                                    },
                                    EQ_Gain_3_Scape_Vx_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Gain%203'
                                    },
                                    EQ_On_3_Scape_Vx_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Section%203'
                                    }
                                }
                            },
                            EQ_4: {
                                type:'stack',
                                title: 'Band 4',
                                widgets: {
                                    EQ_Freq_4_Scape_Vx_Dag: {
                                        title:'Frequency',
                                        range:{'min':200,'max':20000},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Frequency%204'
                                    },
                                    EQ_Band_4_Scape_Vx_Dag: {
                                        title:'BandWidth',
                                        range:{'min':0.125,'max':8},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Bandwidth%204'
                                    },
                                    EQ_Gain_4_Scape_Vx_Dag: {
                                        title:'Gain',
                                        range:{'min':-20,'max':20},
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Gain%204'
                                    },
                                    EQ_On_4_Scape_Vx_Dag: {
                                        type:'button',
                                        title:'Enable EQ',
                                        target:nmPorts['Vocals'],
                                        path:'/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Section%204'
                                    }
                                }
                            },
                        }
                    },
                }
            }
        }
    }
}
