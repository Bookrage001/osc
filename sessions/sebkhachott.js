(function(){

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
nmRange = {'min': -70,'20%': -40,'45%': -20,'60%': -10,'71%':-6,'78%':-3,'85%':0,'92%':3,'max': 6}


return [
    {
        id: "MainMix",
        label: "MainMix",
        widgets: [
            {
                id: "Drums",
                label: "Drums",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/Drums/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Basses",
                label: "Basses",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/Basses/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Guitars",
                label: "Guitars",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/Guitars/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "MxSynths",
                label: "MxSynths",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/MxSynths/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "MxDrums",
                label: "MxDrums",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/MxDrums/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Vocals",
                label: "Vocals",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/Vocals/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Acoustics",
                label: "Acoustics",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/Acoustics/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "FOH",
                label: "FOH",
                range: nmRange,
                target: "SCSon:6678",
                path: "/strip/FOH/Gain/Gain%20(dB)/unscaled",
                color: "accent"
            }
        ]
    },
    {
        id: "Drums",
        label: "Drums",
        tabs: [
            {
                id: "Drumset",
                label: "Drumset",
                widgets: [
                    {
                        id: "Kick",
                        label: "Kick",
                        range: nmRange,
                        target: nmPorts['Drums'],
                        path: "/strip/Kick/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Snare",
                        label: "Snare",
                        range: nmRange,
                        target: nmPorts['Drums'],
                        path: "/strip/Snare/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Toms",
                        label: "Toms",
                        range: nmRange,
                        target: nmPorts['Drums'],
                        path: "/strip/Toms/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "OH_L",
                        label: "OH-L",
                        range: nmRange,
                        target: nmPorts['Drums'],
                        path: "/strip/OH-L/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "OH_R",
                        label: "OH-R",
                        range: nmRange,
                        target: nmPorts['Drums'],
                        path: "/strip/OH-R/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Drums",
                        label: "Drums",
                        range: nmRange,
                        target: nmPorts['MainMix'],
                        path: "/strip/Drums/Gain/Gain%20(dB)/unscaled",
                        color: "accent"
                    }
                ]
            },
            {
                id: "Toms",
                widgets: [
                    {
                        id: "Tom1",
                        label: "Tom1",
                        range: nmRange,
                        target: nmPorts['Toms'],
                        path: "/strip/Tom1/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Tom2",
                        label: "Tom2",
                        range: nmRange,
                        target: nmPorts['Toms'],
                        path: "/strip/Tom2/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Tom3",
                        label: "Tom3",
                        range: nmRange,
                        target: nmPorts['Toms'],
                        path: "/strip/Tom3/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Toms",
                        label: "Toms",
                        range: nmRange,
                        target: nmPorts['Drums'],
                        path: "/strip/Toms/Gain/Gain%20(dB)/unscaled",
                        color: "accent"
                    }
                ]
            },
            {
                id: "EQs",
                tabs: [
                    {
                        id: "EQ_Drums",
                        label: "Drumset",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Drums",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Drums",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Drums",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Drums",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Drums",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Drums",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Drums",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Drums",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Drums",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Drums",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Drums",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Drums",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Drums",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Drums",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Drums",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Drums",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Drums/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_Kick",
                        label: "Kick",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Kick",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Kick",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Kick",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Kick",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Kick",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Kick",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Kick",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Kick",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Kick",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Kick",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Kick",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Kick",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Kick",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Kick",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Kick",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Kick",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Kick/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_Snare",
                        label: "Snare",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Snare",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Snare",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Snare",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Snare",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Snare",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Snare",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Snare",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Snare",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Snare",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Snare",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Snare",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Snare",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Snare",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Snare",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Snare",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Snare",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Snare/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_Tom1",
                        label: "Tom 1",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Tom1",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Tom1",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Tom1",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Tom1",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Tom1",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Tom1",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Tom1",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Tom1",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Tom1",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Tom1",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Tom1",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Tom1",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Tom1",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Tom1",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Tom1",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Tom1",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom1/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_Tom2",
                        label: "Tom 2",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Tom2",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Tom2",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Tom2",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Tom2",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Tom2",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Tom2",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Tom2",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Tom2",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Tom2",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Tom2",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Tom2",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Tom2",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Tom2",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Tom2",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Tom2",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Tom2",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom2/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_Tom3",
                        label: "Tom 3",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Tom3",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Tom3",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Tom3",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Tom3",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Tom3",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Tom3",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Tom3",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Tom3",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Tom3",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Tom3",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Tom3",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Tom3",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Tom3",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Tom3",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Tom3",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Tom3",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/Tom3/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_OH_L",
                        label: "OH-L (ride)",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_OH_L",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_OH_L",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_OH_L",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_OH_L",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_OH_L",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_OH_L",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_OH_L",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_OH_L",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_OH_L",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_OH_L",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_OH_L",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_OH_L",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_OH_L",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_OH_L",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_OH_L",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_OH_L",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-L/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_OH_R",
                        label: "OH-R (hihat)",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_OH_R",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_OH_R",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_OH_R",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_OH_R",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_OH_R",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_OH_R",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_OH_R",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_OH_R",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_OH_R",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_OH_R",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_OH_R",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_OH_R",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_OH_R",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_OH_R",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_OH_R",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_OH_R",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Drums'],
                                        path: "/strip/OH-R/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: "Gates",
                stack:true,
                widgets: [
                    {
                        id: "Gate_Kick",
                        label: "Kick",
                        type: "strip",
                        horizontal:true,
                        widgets: [
                            {
                                id: "Gate_LF_Kick",
                                label: "LF filter",
                                type:"knob",
                                range: {
                                    min: 33.6,
                                    max: 4800
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Kick/Gate/LF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_HF_Kick",
                                label: "HF filter",
                                type:"knob",
                                range: {
                                    min: 240,
                                    max: 23520
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Kick/Gate/HF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_Thresh_Kick",
                                label: "Threshold",
                                type:"knob",
                                range: {
                                    min: -70,
                                    "20%": -40,
                                    "45%": -20,
                                    "60%": -10,
                                    max: 20
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Kick/Gate/Threshold%20(dB)/unscaled"
                            },
                            {
                                id: "Gate_Attack_Kick",
                                label: "Attack (ms)",
                                type:"knob",
                                range: {
                                    min: 0,
                                    max: 1000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Kick/Gate/Attack%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Hold_Kick",
                                label: "Hold (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 2000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Kick/Gate/Hold%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Decay_Kick",
                                label: "Decay (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 4000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Kick/Gate/Decay%20(ms)/unscaled"
                            }
                        ]
                    },
                    {
                        id: "Gate_Snare",
                        label: "Snare",
                        type: "strip",
                        horizontal:true,
                        widgets: [
                            {
                                id: "Gate_LF_Snare",
                                label: "LF filter",
                                type:"knob",
                                range: {
                                    min: 33.6,
                                    max: 4800
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Snare/Gate/LF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_HF_Snare",
                                label: "HF filter",
                                type:"knob",
                                range: {
                                    min: 240,
                                    max: 23520
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Snare/Gate/HF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_Thresh_Snare",
                                label: "Threshold",
                                type:"knob",
                                range: {
                                    min: -70,
                                    "20%": -40,
                                    "45%": -20,
                                    "60%": -10,
                                    max: 20
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Snare/Gate/Threshold%20(dB)/unscaled"
                            },
                            {
                                id: "Gate_Attack_Snare",
                                label: "Attack (ms)",
                                type:"knob",
                                range: {
                                    min: 0,
                                    max: 1000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Snare/Gate/Attack%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Hold_Snare",
                                label: "Hold (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 2000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Snare/Gate/Hold%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Decay_Snare",
                                label: "Decay (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 4000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Snare/Gate/Decay%20(ms)/unscaled"
                            }
                        ]
                    },
                    {
                        id: "Gate_Tom1",
                        label: "Tom1",
                        type: "strip",
                        horizontal:true,
                        widgets: [
                            {
                                id: "Gate_LF_Tom1",
                                label: "LF filter",
                                type:"knob",
                                range: {
                                    min: 33.6,
                                    max: 4800
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom1/Gate/LF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_HF_Tom1",
                                label: "HF filter",
                                type:"knob",
                                range: {
                                    min: 240,
                                    max: 23520
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom1/Gate/HF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_Thresh_Tom1",
                                label: "Threshold",
                                type:"knob",
                                range: {
                                    min: -70,
                                    "20%": -40,
                                    "45%": -20,
                                    "60%": -10,
                                    max: 20
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom1/Gate/Threshold%20(dB)/unscaled"
                            },
                            {
                                id: "Gate_Attack_Tom1",
                                label: "Attack (ms)",
                                type:"knob",
                                range: {
                                    min: 0,
                                    max: 1000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom1/Gate/Attack%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Hold_Tom1",
                                label: "Hold (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 2000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom1/Gate/Hold%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Decay_Tom1",
                                label: "Decay (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 4000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom1/Gate/Decay%20(ms)/unscaled"
                            }
                        ]
                    },
                    {
                        id: "Gate_Tom2",
                        label: "Tom2",
                        type: "strip",
                        horizontal:true,
                        widgets: [
                            {
                                id: "Gate_LF_Tom2",
                                label: "LF filter",
                                type:"knob",
                                range: {
                                    min: 33.6,
                                    max: 4800
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom2/Gate/LF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_HF_Tom2",
                                label: "HF filter",
                                type:"knob",
                                range: {
                                    min: 240,
                                    max: 23520
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom2/Gate/HF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_Thresh_Tom2",
                                label: "Threshold",
                                type:"knob",
                                range: {
                                    min: -70,
                                    "20%": -40,
                                    "45%": -20,
                                    "60%": -10,
                                    max: 20
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom2/Gate/Threshold%20(dB)/unscaled"
                            },
                            {
                                id: "Gate_Attack_Tom2",
                                label: "Attack (ms)",
                                type:"knob",
                                range: {
                                    min: 0,
                                    max: 1000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom2/Gate/Attack%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Hold_Tom2",
                                label: "Hold (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 2000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom2/Gate/Hold%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Decay_Tom2",
                                label: "Decay (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 4000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom2/Gate/Decay%20(ms)/unscaled"
                            }
                        ]
                    },
                    {
                        id: "Gate_Tom3",
                        label: "Tom3",
                        type: "strip",
                        horizontal:true,
                        widgets: [
                            {
                                id: "Gate_LF_Tom3",
                                label: "LF filter",
                                type:"knob",
                                range: {
                                    min: 33.6,
                                    max: 4800
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom3/Gate/LF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_HF_Tom3",
                                label: "HF filter",
                                type:"knob",
                                range: {
                                    min: 240,
                                    max: 23520
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom3/Gate/HF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_Thresh_Tom3",
                                label: "Threshold",
                                type:"knob",
                                range: {
                                    min: -70,
                                    "20%": -40,
                                    "45%": -20,
                                    "60%": -10,
                                    max: 20
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom3/Gate/Threshold%20(dB)/unscaled"
                            },
                            {
                                id: "Gate_Attack_Tom3",
                                label: "Attack (ms)",
                                type:"knob",
                                range: {
                                    min: 0,
                                    max: 1000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom3/Gate/Attack%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Hold_Tom3",
                                label: "Hold (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 2000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom3/Gate/Hold%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Decay_Tom3",
                                label: "Decay (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 4000
                                },
                                target: nmPorts['Drums'],
                                path: "/strip/Tom3/Gate/Decay%20(ms)/unscaled"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "Basses",
        label: "Basses",
        tabs: [
            {
                id: "Main",
                widgets: [
                    {
                        id: "Bass_ORL",
                        label: "Bass Orl",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/Bass_ORL/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Bass_Dag",
                        label: "Bass Dag",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/Bass_Dag/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Basses",
                        label: "Basses",
                        range: nmRange,
                        target: nmPorts['MainMix'],
                        path: "/strip/Basses/Gain/Gain%20(dB)/unscaled",
                        color: "accent"
                    }
                ]
            },
            {
                id: "Orl",
                widgets: [
                    {
                        id: "Oct_Bass_ORL",
                        label: "Octaver",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/Oct_Bass_ORL/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Disto_Bass_ORL",
                        label: "Disto",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/Disto_Bass_ORL/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "FX_Bass_ORL",
                        label: "Fx",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/FX_Bass_ORL/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Bass_ORL",
                        label: "Basse Orl",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/Bass_ORL/Gain/Gain%20(dB)/unscaled",
                        color: "accent"
                    }
                ]
            },
            {
                id: "Dag",
                widgets: [
                    {
                        id: "Oct_Bass_Dag",
                        label: "Octaver",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/Oct_Bass_Dag/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Disto_Bass_Dag",
                        label: "Disto",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/Disto_Bass_Dag/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "FX_Bass_Dag",
                        label: "Fx",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/FX_Bass_Dag/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Bass_Dag",
                        label: "Basse Dag",
                        range: nmRange,
                        target: nmPorts['Basses'],
                        path: "/strip/Bass_Dag/Gain/Gain%20(dB)/unscaled",
                        color: "accent"
                    }
                ]
            },
            {
                id: "EQs",
                tabs: [
                    {
                        id: "EQ_Bass_Dag",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Bass_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Bass_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Bass_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Bass_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Bass_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Bass_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Bass_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Bass_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Bass_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Bass_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Bass_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Bass_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Bass_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Bass_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Bass_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Bass_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Basses'],
                                        path: "/strip/Bass_Dag/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "Guitars",
        label: "Guitars",
        widgets: [
            {
                id: "Guitar_ORL",
                label: "Guitar_ORL",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/Guitar_ORL/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "FX_Gtr_ORL_1",
                label: "FX_Gtr_ORL_1",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/FX_Gtr_ORL_1/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "FX_Gtr_ORL_2",
                label: "FX_Gtr_ORL_2",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/FX_Gtr_ORL_2/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "FX_Gtr_ORL",
                label: "FX_Gtr_ORL",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/FX_Gtr_ORL/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Guitar_Dag",
                label: "Guitar_Dag",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/Guitar_Dag/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "FX_Gtr_Dag_1",
                label: "FX_Gtr_Dag_1",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/FX_Gtr_Dag_1/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "FX_Gtr_Dag_2",
                label: "FX_Gtr_Dag_2",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/FX_Gtr_Dag_2/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "FX_Gtr_Dag",
                label: "FX_Gtr_Dag",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/FX_Gtr_Dag/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Scape_Gtr_Dag",
                label: "Scape_Gtr_Dag",
                range: nmRange,
                target: nmPorts['Guitars'],
                path: "/strip/Scape_Gtr_Dag/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Guitars",
                label: "Guitars",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/Guitars/Gain/Gain%20(dB)/unscaled",
                color: "accent"
            }
        ]
    },
    {
        id: "MxSynths",
        label: "MxSynths",
        tabs: [
            {
                id: "Main",
                widgets: [
                    {
                        id: "MxBass",
                        label: "MxBass",
                        range: nmRange,
                        target: nmPorts['MxSynths'],
                        path: "/strip/MxBass/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxChords",
                        label: "MxChords",
                        range: nmRange,
                        target: nmPorts['MxSynths'],
                        path: "/strip/MxChords/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxLead",
                        label: "MxLead",
                        range: nmRange,
                        target: nmPorts['MxSynths'],
                        path: "/strip/MxLead/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxCtLead",
                        label: "MxCtLead",
                        range: nmRange,
                        target: nmPorts['MxSynths'],
                        path: "/strip/MxCtLead/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxClassical",
                        label: "MxClassical",
                        range: nmRange,
                        target: nmPorts['MxSynths'],
                        path: "/strip/MxClassical/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxSynths",
                        label: "MxSynths",
                        range: nmRange,
                        target: nmPorts['MainMix'],
                        path: "/strip/MxSynths/Gain/Gain%20(dB)/unscaled",
                        color: "accent"
                    }
                ]
            },
            {
                id: "EQs",
                tabs: [
                    {
                        id: "EQ_MxBass",
                        label: "MxBass",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_MxBass",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_MxBass",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_MxBass",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_MxBass",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_MxBass",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_MxBass",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_MxBass",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_MxBass",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_MxBass",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_MxBass",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_MxBass",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_MxBass",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_MxBass",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_MxBass",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_MxBass",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_MxBass",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxSynths'],
                                        path: "/strip/MxBass/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "MxDrums",
        label: "MxDrums",
        tabs: [
            {
                id: "Main",
                widgets: [
                    {
                        id: "MxKicks",
                        label: "MxKicks",
                        range: nmRange,
                        target: nmPorts['MxDrums'],
                        path: "/strip/MxKicks/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxSnares",
                        label: "MxSnares",
                        range: nmRange,
                        target: nmPorts['MxDrums'],
                        path: "/strip/MxSnares/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxCymbs",
                        label: "MxCymbs",
                        range: nmRange,
                        target: nmPorts['MxDrums'],
                        path: "/strip/MxCymbs/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxCont",
                        label: "MxCont",
                        range: nmRange,
                        target: nmPorts['MxDrums'],
                        path: "/strip/MxCont/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxSamples",
                        label: "MxSamples",
                        range: nmRange,
                        target: nmPorts['MxDrums'],
                        path: "/strip/MxSamples/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "MxDrums",
                        label: "MxDrums",
                        range: nmRange,
                        target: nmPorts['MainMix'],
                        path: "/strip/MxDrums/Gain/Gain%20(dB)/unscaled",
                        color: "accent"
                    }
                ]
            },
            {
                id: "EQs",
                tabs: [
                    {
                        id: "EQ_MxKicks",
                        label: "MxKicks",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_MxKicks",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_MxKicks",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_MxKicks",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_MxKicks",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_MxKicks",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_MxKicks",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_MxKicks",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_MxKicks",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_MxKicks",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_MxKicks",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_MxKicks",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_MxKicks",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_MxKicks",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_MxKicks",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_MxKicks",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_MxKicks",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxKicks/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_MxCymbs",
                        label: "MxCymbs",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_MxCymbs",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_MxCymbs",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_MxCymbs",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_MxCymbs",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_MxCymbs",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_MxCymbs",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_MxCymbs",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_MxCymbs",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_MxCymbs",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_MxCymbs",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_MxCymbs",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_MxCymbs",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_MxCymbs",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_MxCymbs",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_MxCymbs",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_MxCymbs",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['MxDrums'],
                                        path: "/strip/MxCymbs/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: "Acoustics",
        label: "Acoustics",
        widgets: [
            {
                id: "PianoToy",
                label: "PianoToy",
                range: nmRange,
                target: nmPorts['Acoustics'],
                path: "/strip/PianoToy/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Cymbalum",
                label: "Cymbalum",
                range: nmRange,
                target: nmPorts['Acoustics'],
                path: "/strip/Cymbalum/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "GuitarAc",
                label: "GuitarAc",
                range: nmRange,
                target: nmPorts['Acoustics'],
                path: "/strip/GuitarAc/Gain/Gain%20(dB)/unscaled"
            },
            {
                id: "Acoustics",
                label: "Acoustics",
                range: nmRange,
                target: nmPorts['MainMix'],
                path: "/strip/Acoustics/Gain/Gain%20(dB)/unscaled",
                color: "accent"
            }
        ]
    },
    {
        id: "Vocals",
        label: "Vocals",
        tabs: [
            {
                id: "Main",
                widgets: [
                    {
                        id: "Vx_ORL",
                        label: "Vx_ORL",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/Vx_ORL/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "FX_Vx_ORL_1",
                        label: "FX_Vx_ORL_1",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/FX_Vx_ORL_1/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "FX_Vx_ORL_2",
                        label: "FX_Vx_ORL_2",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/FX_Vx_ORL_2/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "FX_Vx_ORL",
                        label: "FX_Vx_ORL",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/FX_Vx_ORL/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Vx_Dag",
                        label: "Vx_Dag",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/Vx_Dag/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "FX_Vx_Dag_1",
                        label: "FX_Vx_Dag_1",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/FX_Vx_Dag_1/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "FX_Vx_Dag_2",
                        label: "FX_Vx_Dag_2",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/FX_Vx_Dag_2/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "FX_Vx_Dag",
                        label: "FX_Vx_Dag",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/FX_Vx_Dag/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Scape_Vx_Dag",
                        label: "Scape_Vx_Dag",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/Scape_Vx_Dag/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Vx_Jeannot",
                        label: "Vx_Jeannot",
                        range: nmRange,
                        target: nmPorts['Vocals'],
                        path: "/strip/Vx_Jeannot/Gain/Gain%20(dB)/unscaled"
                    },
                    {
                        id: "Vocals",
                        label: "Vocals",
                        range: nmRange,
                        target: nmPorts['MainMix'],
                        path: "/strip/Vocals/Gain/Gain%20(dB)/unscaled",
                        color: "accent"
                    }
                ]
            },
            {
                id: "EQs",
                tabs: [
                    {
                        id: "EQ_Vx_ORL",
                        label: "ORL",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Vx_ORL",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Vx_ORL",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Vx_ORL",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Vx_ORL",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Vx_ORL",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Vx_ORL",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Vx_ORL",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Vx_ORL",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Vx_ORL",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Vx_ORL",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Vx_ORL",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Vx_ORL",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Vx_ORL",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Vx_ORL",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Vx_ORL",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Vx_ORL",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_ORL/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_Vx_Dag",
                        label: "Dag",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Vx_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Vx_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Vx_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Vx_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Vx_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Vx_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Vx_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Vx_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Vx_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Vx_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Vx_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Vx_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Vx_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Vx_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Vx_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Vx_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Vx_Dag/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "EQ_Scape_Vx_Dag",
                        label: "Scape Dag",
                        widgets: [
                            {
                                id: "EQ_1",
                                type: "strip",
                                label: "Band 1",
                                widgets: [
                                    {
                                        id: "EQ_Freq_1_Scape_Vx_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 20,
                                            max: 2000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Frequency%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_1_Scape_Vx_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Bandwidth%201/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_1_Scape_Vx_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Gain%201/unscaled"
                                    },
                                    {
                                        id: "EQ_On_1_Scape_Vx_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Section%201/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_2",
                                type: "strip",
                                label: "Band 2",
                                widgets: [
                                    {
                                        id: "EQ_Freq_2_Scape_Vx_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 40,
                                            max: 4000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Frequency%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_2_Scape_Vx_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Bandwidth%202/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_2_Scape_Vx_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Gain%202/unscaled"
                                    },
                                    {
                                        id: "EQ_On_2_Scape_Vx_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Section%202/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_3",
                                type: "strip",
                                label: "Band 3",
                                widgets: [
                                    {
                                        id: "EQ_Freq_3_Scape_Vx_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 100,
                                            max: 10000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Frequency%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_3_Scape_Vx_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Bandwidth%203/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_3_Scape_Vx_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Gain%203/unscaled"
                                    },
                                    {
                                        id: "EQ_On_3_Scape_Vx_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Section%203/unscaled"
                                    }
                                ]
                            },
                            {
                                id: "EQ_4",
                                type: "strip",
                                label: "Band 4",
                                widgets: [
                                    {
                                        id: "EQ_Freq_4_Scape_Vx_Dag",
                                        label: "Frequency",
                                        type:"knob",
                                        range: {
                                            min: 200,
                                            max: 20000
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Frequency%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Band_4_Scape_Vx_Dag",
                                        label: "BandWidth",
                                        type:"knob",
                                        range: {
                                            min: 0.125,
                                            max: 8
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Bandwidth%204/unscaled"
                                    },
                                    {
                                        id: "EQ_Gain_4_Scape_Vx_Dag",
                                        label: "Gain",
                                        type:"knob",
                                        range: {
                                            min: -20,
                                            max: 20
                                        },
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Gain%204/unscaled"
                                    },
                                    {
                                        id: "EQ_On_4_Scape_Vx_Dag",
                                        type: "toggle",
                                        label: "Enable EQ",
                                        target: nmPorts['Vocals'],
                                        path: "/strip/Scape_Vx_Dag/4-band%20parametric%20filter/Section%204/unscaled"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id: "Gates",
                stack:true,
                widgets: [
                    {
                        id: "Gate_Vx_Dag",
                        label: "Vx_Dag",
                        type: "strip",
                        horizontal:true,
                        widgets: [
                            {
                                id: "Gate_LF_Vx_Dag",
                                label: "LF filter",
                                type:"knob",
                                range: {
                                    min: 33.6,
                                    max: 4800
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_Dag/Gate/LF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_HF_Vx_Dag",
                                label: "HF filter",
                                type:"knob",
                                range: {
                                    min: 240,
                                    max: 23520
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_Dag/Gate/HF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_Thresh_Vx_Dag",
                                label: "Threshold",
                                type:"knob",
                                range: {
                                    min: -70,
                                    "20%": -40,
                                    "45%": -20,
                                    "60%": -10,
                                    max: 20
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_Dag/Gate/Threshold%20(dB)/unscaled"
                            },
                            {
                                id: "Gate_Attack_Vx_Dag",
                                label: "Attack (ms)",
                                type:"knob",
                                range: {
                                    min: 0,
                                    max: 1000
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_Dag/Gate/Attack%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Hold_Vx_Dag",
                                label: "Hold (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 2000
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_Dag/Gate/Hold%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Decay_Vx_Dag",
                                label: "Decay (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 4000
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_Dag/Gate/Decay%20(ms)/unscaled"
                            }
                        ]
                    },
                    {
                        id: "Gate_Vx_ORL",
                        label: "Vx_ORL",
                        type: "strip",
                        horizontal:true,
                        widgets: [
                            {
                                id: "Gate_LF_Vx_ORL",
                                label: "LF filter",
                                type:"knob",
                                range: {
                                    min: 33.6,
                                    max: 4800
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_ORL/Gate/LF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_HF_Vx_ORL",
                                label: "HF filter",
                                type:"knob",
                                range: {
                                    min: 240,
                                    max: 23520
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_ORL/Gate/HF%20key%20filter%20(Hz)/unscaled"
                            },
                            {
                                id: "Gate_Thresh_Vx_ORL",
                                label: "Threshold",
                                type:"knob",
                                range: {
                                    min: -70,
                                    "20%": -40,
                                    "45%": -20,
                                    "60%": -10,
                                    max: 20
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_ORL/Gate/Threshold%20(dB)/unscaled"
                            },
                            {
                                id: "Gate_Attack_Vx_ORL",
                                label: "Attack (ms)",
                                type:"knob",
                                range: {
                                    min: 0,
                                    max: 1000
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_ORL/Gate/Attack%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Hold_Vx_ORL",
                                label: "Hold (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 2000
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_ORL/Gate/Hold%20(ms)/unscaled"
                            },
                            {
                                id: "Gate_Decay_Vx_ORL",
                                label: "Decay (ms)",
                                type:"knob",
                                range: {
                                    min: 2,
                                    max: 4000
                                },
                                target: nmPorts['Vocals'],
                                path: "/strip/Vx_ORL/Gate/Decay%20(ms)/unscaled"
                            }
                        ]
                    }
                ]
            }
        ]
    }
]
})()
