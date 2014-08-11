import oschtmlgui
from os import path as os_path

#Ports osc des clients NonMixer
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

# Patch gui > NonMixer
pathPatch = {
    
    #MainMix
    'Drums':['/strip/Drums',nmPorts['MainMix']],
    'Basses':['/strip/Basses',nmPorts['MainMix']],
    'Guitars':['/strip/Guitars',nmPorts['MainMix']],
    'MxSynths':['/strip/MxSynths',nmPorts['MainMix']],
    'MxDrums':['/strip/MxDrums',nmPorts['MainMix']],
    'Vocals':['/strip/Vocals',nmPorts['MainMix']],
    'Acoustics':['/strip/Acoustics',nmPorts['MainMix']],

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
        'Oct_Bass_ORL':['/strip/Oct_Bass_ORL',nmPorts['Basses']],
        'FX_Bass_ORL':['/strip/FX_Bass_ORL',nmPorts['Basses']],
        'Bass_Dag':['/strip/Bass_Dag',nmPorts['Basses']],
        'Oct_Bass_Dag':['/strip/Oct_Bass_Dag',nmPorts['Basses']],
        'FX_Bass_Dag':['/strip/FX_Bass_Dag',nmPorts['Basses']],
    
        #Guitars
        'Guitar_ORL':['/strip/Guitar_ORL',nmPorts['Guitars']],
        'FX_Gtr_ORL_1':['/strip/FX_Gtr_ORL_1',nmPorts['Guitars']],
        'FX_Gtr_ORL_2':['/strip/FX_Gtr_ORL_2',nmPorts['Guitars']],
        'FX_Gtr_ORL':['/strip/FX_Gtr_ORL',nmPorts['Guitars']],
        'Guitar_Dag':['/strip/Guitar_Dag',nmPorts['Guitars']],
        'FX_Gtr_Dag_1':['/strip/FX_Gtr_Dag_1',nmPorts['Guitars']],
        'FX_Gtr_Dag_2':['/strip/FX_Gtr_Dag_2',nmPorts['Guitars']],
        'FX_Gtr_Dag':['/strip/FX_Gtr_Dag',nmPorts['Guitars']],
        'Scape_Gtr_Dag':['/strip/Scape_Gtr_Dag',nmPorts['Guitars']],
    
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
        
        #Acoustics
        'PianoToy':['/strip/PianoToy',nmPorts['Acoustics']],
        'Cymbalum':['/strip/Cymbalum',nmPorts['Acoustics']],
        'GuitarAc':['/strip/GuitarAc',nmPorts['Acoustics']],
    
        #Vocals
        'Vx_ORL':['/strip/Vx_ORL',nmPorts['Vocals']],
        'FX_Vx_ORL_1':['/strip/FX_Vx_ORL_1',nmPorts['Vocals']],
        'FX_Vx_ORL_2':['/strip/FX_Vx_ORL_2',nmPorts['Vocals']],
        'FX_Vx_ORL':['/strip/FX_Vx_ORL',nmPorts['Vocals']],
        'Vx_Dag':['/strip/Vx_Dag',nmPorts['Vocals']],
        'FX_Vx_Dag_1':['/strip/FX_Vx_Dag_1',nmPorts['Vocals']],
        'FX_Vx_Dag_2':['/strip/FX_Vx_Dag_2',nmPorts['Vocals']],
        'FX_Vx_Dag':['/strip/FX_Vx_Dag',nmPorts['Vocals']],
        'Scape_Vx_Dag':['/strip/Scape_Vx_Dag',nmPorts['Vocals']],
        'Vx_Jeannot':['/strip/Vx_Jeannot',nmPorts['Vocals']],
        
    #Mains
    'FOH':['/strip/FOH',nmPorts['Mains']],
    'MonitorsJeannot':['/strip/MonitorsJeannot',nmPorts['Mains']],
    'MonitorsORL':['/strip/MonitorsORL',nmPorts['Mains']],
    'MonitorsDag':['/strip/MonitorsDag',nmPorts['Mains']],
    
        #MonitorsDag
        'mdDrums':['/strip/Drums',nmPorts['MonitorsDag']],
        'mdBasses':['/strip/Basses',nmPorts['MonitorsDag']],
        'mdGuitars':['/strip/Guitars',nmPorts['MonitorsDag']],
        'mdMxDrums':['/strip/MxDrums',nmPorts['MonitorsDag']],
        'mdMxSynths':['/strip/MxSynths',nmPorts['MonitorsDag']],
        'mdVocals':['/strip/Vocals',nmPorts['MonitorsDag']],
        'mdBassDag':['/strip/BassDag',nmPorts['MonitorsDag']],
        'mdGuitarDag':['/strip/GuitarDag',nmPorts['MonitorsDag']],
        'mdVoixDag':['/strip/VoixDag',nmPorts['MonitorsDag']],
        'mdMetronome':['/strip/Metronome',nmPorts['MonitorsDag']],
        
        #MonitorsJeannot
        'mjDrums':['/strip/Drums',nmPorts['MonitorsJeannot']],
        'mjBasses':['/strip/Basses',nmPorts['MonitorsJeannot']],
        'mjGuitars':['/strip/Guitars',nmPorts['MonitorsJeannot']],
        'mjMxDrums':['/strip/MxDrums',nmPorts['MonitorsJeannot']],
        'mjMxSynths':['/strip/MxSynths',nmPorts['MonitorsJeannot']],
        'mjVocals':['/strip/Vocals',nmPorts['MonitorsJeannot']],
        'mjMetronome':['/strip/Metronome',nmPorts['MonitorsJeannot']],

        #MonitorsORL
        'moDrums':['/strip/Drums',nmPorts['MonitorsORL']],
        'moBasses':['/strip/Basses',nmPorts['MonitorsORL']],
        'moGuitars':['/strip/Guitars',nmPorts['MonitorsORL']],
        'moMxDrums':['/strip/MxDrums',nmPorts['MonitorsORL']],
        'moMxSynths':['/strip/MxSynths',nmPorts['MonitorsORL']],
        'moVocals':['/strip/Vocals',nmPorts['MonitorsORL']],
        'moBassORL':['/strip/BassORL',nmPorts['MonitorsORL']],
        'moGuitarORL':['/strip/GuitarORL',nmPorts['MonitorsORL']],
        'moVxORL':['/strip/VxORL',nmPorts['MonitorsORL']],
        'moMetronome':['/strip/Metronome',nmPorts['MonitorsORL']],
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

gui = oschtmlgui.oscHtmlGui(port=3333, target='127.0.0.1:3334', appName='oscWebGui', presetName=preset_name,html=html_path)

router = oschtmlgui.oscRouter(port=3334, pathPatch=pathPatch, paramPatch=paramPatch)
router.start()

gui.main()
