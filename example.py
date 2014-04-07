import oscwebgui
from os import path as os_path

#Ports osc des clients NonMixer
nmPorts = {
    'MainMix':6666,
    'Drums':6667,
    'Basses':6668,
    'Guitars':6669,
    'MxSynths':6670,
    'MxDrums':6671,
    'Vocals':6672,
    'Toms':6673,
    'Acoustics':6674,
    'MonitorsDag':6675,
    'MonitorsJeannot':6676,
    'MonitorsOrl':6677,
    'Mains':6678,
}

# Patch gui > NonMixer
pathPatch = {
    
    #MainMix
    'Drums':['/strip/Drums',nmPorts['MainMix']],
    'Basses':['/strip/Basses',nmPorts['MainMix']],
    'Guitars':['/strip/Guitars',nmPorts['MainMix']],
    'MxSynths':['/strip/MxSynths',nmPorts['MainMix']],
    'MxDrums':['/strip/MxDrums',nmPorts['MainMix']],
    'Vocals':['/strip/Vocals',nmPorts['MainMix']],

        #Drums
        'Kick':['/strip/Kick',nmPorts['Drums']],
        'Snare':['/strip/Snare',nmPorts['Drums']],
        'Toms':['/strip/Toms',nmPorts['Drums']],
        'OH-L':['/strip/OH-L',nmPorts['Drums']],
        'OH-R':['/strip/OH-R',nmPorts['Drums']],

            #Toms
            'Tom1':['/strip/Tom1',nmPorts['Toms']],
            'Tom2':['/strip/Tom2',nmPorts['Toms']],
            'Tom3':['/strip/Tom3',nmPorts['Toms']],
    
        #Basses
        'Bass_ORL':['/strip/Bass_ORL',nmPorts['Basses']],
        'FX_ORL':['/strip/FX_ORL',nmPorts['Basses']],
        'Bass_Dag':['/strip/Bass_Dag',nmPorts['Basses']],
    
        #Guitars
        'Guitar_ORL':['/strip/Guitar_ORL',nmPorts['Guitars']],
        'Guitar_Dag':['/strip/Guitar_Dag',nmPorts['Guitars']],
    
        #MxSynths
        'MxBass':['/strip/MxBass',nmPorts['MxSynths']],
        'MxChords':['/strip/MxChords',nmPorts['MxSynths']],
        'MxLead':['/strip/MxLead',nmPorts['MxSynths']],
        'MxCtLead':['/strip/MxCtLead',nmPorts['MxSynths']],
        'MxClassical':['/strip/MxClassical',nmPorts['MxSynths']],
    
        #MxDrums
        'MxKicks':['/strip/MxKicks',nmPorts['MxDrums']],
        'MxSnares':['/strip/MxSnares',nmPorts['MxDrums']],
        'MxCymbs':['/strip/MxCymbs',nmPorts['MxDrums']],
        'MxCont':['/strip/MxCont',nmPorts['MxDrums']],
        'MxSamples':['/strip/MxSamples',nmPorts['MxDrums']],
    
        #Vocals
        'Vx_ORL':['/strip/Vx_ORL',nmPorts['Vocals']],
        'Vx_Dag':['/strip/Vx_Dag',nmPorts['Vocals']],
        'Vx_Jeannot':['/strip/Vx_Jeannot',nmPorts['Vocals']],
        
    #Mains
    'FOH':['/strip/FOH',nmPorts['Mains']],
    'MonitorsJeannot':['/strip/nitorsJeannot',nmPorts['Mains']],
    'MonitorsORL':['/strip/nitorsORL',nmPorts['Mains']],
    'MonitorsDag':['/strip/nitorsDag',nmPorts['Mains']],
    
        #MonitorsDag
        'mdMainMix':['/strip/MainMix',nmPorts['MonitorsDag']],
        'mdDrums':['/strip/Drums',nmPorts['MonitorsDag']],
        'mdBassDag':['/strip/BassDag',nmPorts['MonitorsDag']],
        'mdGuitarDag':['/strip/GuitarDag',nmPorts['MonitorsDag']],
        'mdVoixDag':['/strip/VoixDag',nmPorts['MonitorsDag']],
        'mdMetronome':['/strip/Metronome',nmPorts['MonitorsDag']],
        
        #MonitorsJeannot
        'mjMainMix':['/strip/MainMix',nmPorts['MonitorsJeannot']],
        'mjDrums':['/strip/Drums',nmPorts['MonitorsJeannot']],
        'mjVocals':['/strip/Vocals',nmPorts['MonitorsJeannot']],
        'mjGuitars':['/strip/Guitars',nmPorts['MonitorsJeannot']],
        'mjBasses':['/strip/Basses',nmPorts['MonitorsJeannot']],
        'mjMetronome':['/strip/Metronome',nmPorts['MonitorsJeannot']],

        #MonitorsOrl
        'moMainMix':['/strip/MainMix',nmPorts['MonitorsOrl']],
        'moDrums':['/strip/Drums',nmPorts['MonitorsOrl']],
        'moBassORL':['/strip/BassORL',nmPorts['MonitorsOrl']],
        'moGuitarORL':['/strip/GuitarORL',nmPorts['MonitorsOrl']],
        'moVxORL':['/strip/VxORL',nmPorts['MonitorsOrl']],
        'moMetronome':['/strip/Metronome',nmPorts['MonitorsOrl']],

}

#Parametre gui > NonMixer
paramPatch = {
    'Gain':'Gain/Gain%20(dB)',
    'Pan':'Mono%20Pan/Pan',
    'Mute':'Gain/Mute'
}




example_path = os_path.dirname(os_path.abspath(__file__)) + '/example/'
html_path = example_path + 'sebkha.html'
preset_name = example_path + 'sebkha'

gui = oscwebgui.oscWebGui(port=3333, target='127.0.0.1:3334', appName='oscWebGui', presetName=preset_name,html=html_path)

router = oscwebgui.oscRouter(port=3334, target='SCSon', pathPatch=pathPatch, paramPatch=paramPatch)
router.start()

gui.main()
