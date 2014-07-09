import oscwebgui
from os import path as os_path

#Ports osc des clients NonMixer
targets = {
    'MainMix':'SCSon:6666',
    'Mains':'SCSon:6678',
    'qlc': 'CtrlRegie:7770',
'MonitorsJeannot':'SCSon:6676',
'Mains':'SCSon:6678',
}

# Patch gui > NonMixer
pathPatch = {
    
	#MainMix
	'Drums':['/strip/Drums',targets['MainMix']],
	'Basses':['/strip/Basses',targets['MainMix']],
	'Guitars':['/strip/Guitars',targets['MainMix']],
	'MxSynths':['/strip/MxSynths',targets['MainMix']],
	'MxDrums':['/strip/MxDrums',targets['MainMix']],
	'Vocals':['/strip/Vocals',targets['MainMix']],
	'Acoustics':['/strip/Acoustics',targets['MainMix']],
	'FOH':['/strip/FOH',targets['Mains']],
	'DecoupeOrl':['/DecoupeOrl',targets['qlc']],

	#MonitorsJeannot
	'mjMainMix':['/strip/MainMix',targets['MonitorsJeannot']],
	'mjDrums':['/strip/Drums',targets['MonitorsJeannot']],
	'mjVocals':['/strip/Vocals',targets['MonitorsJeannot']],
	'mjGuitars':['/strip/Guitars',targets['MonitorsJeannot']],
	'mjBasses':['/strip/Basses',targets['MonitorsJeannot']],
	'mjMetronome':['/strip/Metronome',targets['MonitorsJeannot']],
'MonitorsJeannot':['/strip/MonitorsJeannot',targets['Mains']],

}

#Parametre gui > NonMixer
paramPatch = {
    'Gain':'Gain/Gain%20(dB)',
    'Pan':'Mono%20Pan/Pan',
    'Mute':'Gain/Mute'
}




example_path = os_path.dirname(os_path.abspath(__file__)) + '/example/'
html_path = example_path + 'regieNico.html'
preset_name = example_path + 'regieNico'

gui = oscwebgui.oscWebGui(port=3333, target='127.0.0.1:3334', appName='oscWebGui', presetName=preset_name,html=html_path)

router = oscwebgui.oscRouter(port=3334, pathPatch=pathPatch, paramPatch=paramPatch)
router.start()

gui.main()
