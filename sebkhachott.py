import sys
from os import path as os_path
sys.path.append(os_path.dirname(os_path.abspath(__file__))+'/lib')
from oschtmlgui import oscHtmlGui


gui = oscHtmlGui(
    port=3333, 
    presetName='sebkhachott',
    config='sebkhachott.js'
)


gui.main()
