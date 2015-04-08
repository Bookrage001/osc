#!/usr/bin/env python
#encoding=utf8
"""
Osc Html Gui
Build your own OSC control gui with html/css/javascript !

>>> import oschtmlgui
>>> gui = oscHtmlGui(config='/path/to/config.js')
>>> gui.main()

Parameters :
  port        input port for external sync of the gui
  appName     name of the gui window
  presetName  user values can be saved by the gui in presetName.preset
  config      path (relative or absolute) to the javascript config file which lists the widgets in the gui  
  
Config file :

The config file is basically a javascript file which must define the variable TABS as a dictionnary :

TABS = {
    
    // Here are the main tabs

    id_of_tab_1:{
        title: "title", // as displayed in the gui (uses id as fallback)
        strips: {
        
            // List of widgets (only strips/vertical faders for now)
        
            id_of_strip_1: {
                title: "title", // as displayed in the gui (uses id as fallback)
                target: "ip_adress:port", // you can specify multiple targets separated spaces
                path: "/osc/path",
                args: "extra osc args", // separeted by spaces (optionnal) prepended to the numerical argument controled by the widget
                range: {'min':0,'30%':10,'90%',20,'max':30}, // defines the range of the numerical argument, only min and max are required 
                                                            // you can directly set range:'db' for a log scale (between -70db and 6dB, designed for non mixer)
                color:'#333', // optionnal, css color definition (hex, rgb, rgba or standard color name)
                scale1: // ONLY IF YOU WANT THE OSC MESSAGE TO BE RESCALED BETWEEN 0 AND 1
            },
            
            id_of_strip_2  {
                ...
            }
        }
    },
    
    id_of_tab_2:{
        title: "title",
        // Nested tabs !!
        id_of_subtab_1: {
            title: "...",
            strips: {
                ...
            }
        }
}

"""
import gtk, webkit, gobject, liblo as _liblo
from os import path as os_path

class oscHtmlGui(object):
    def __init__(self,port=None, appName='oscHtmlgui', presetName='oscHtmlgui', config=None):
        
        self.port = port
        self.presetName = presetName
        self.html =  os_path.dirname(os_path.abspath(__file__)) + '/base.html'


        try:
            self.configfile = open(config,'r')
        except:
            raise Exception('*** config file file cannot be read !')
        
        if self.port:    
            self.server = _liblo.ServerThread(self.port)
            self.server.register_methods(self)
            self.server.start()
        
        self.window = gtk.Window()
        self.window.set_title(appName)
        self.browser = webkit.WebView()

        self.box = gtk.VBox(homogeneous=False, spacing=0)
        self.window.add(self.box)

        self.box.pack_start(self.browser, expand=True, fill=True, padding=0)

        self.browser.open(self.html)

        self.window.set_default_size(400, 600)
        self.window.show_all()
        self.window.connect("destroy", gtk.main_quit)
        
        self.connect_title_changed(self.browser, self.title_changed)
        
        gobject.threads_init()
        
    def main(self):
        gtk.main()
        
    def connect_title_changed(self, browser, callback):
        def callback_wrapper(widget, frame, title): callback(title)
        self.browser.connect('title-changed', callback_wrapper)


    def title_changed(self, title):
        if title != 'null':
            if title.split(',')[0] == 'INIT':
                self.async_gtk_msg(self.browser.execute_script)(self.configfile.read())
                self.async_gtk_msg(self.browser.execute_script)('init()')
                
            elif title.split(',')[0] == 'Load':
                try:
                    f = open(self.presetName+'.preset','r')
                except:
                    self.alertError(self.presetName+'.preset'+' not found !')
                    return
                    
                preset = f.read().replace('\n',';')
                self.async_gtk_msg(self.browser.execute_script)('loadPreset("'+preset+'")')
       
            elif title.split(',')[0] == 'Save':
                try:
                    preset = title.split(',')[1]
                    f = open(self.presetName+'.preset','w')
                    f.write(preset.replace(';','\n'))
                    f.close()
                    self.alertError('Preset Saved')
                except:
                    self.alertError('Could not save the preset...')
                    
            elif title.split(',')[0] == 'Fullscreen':
                self.toggleFullscreen(title.split(',')[1])
                
            elif title.split(',')[0] == 'Send':
                target = title.split(',')[1]
                path = title.split(',')[2]
                args = title.split(',')[3:]
                try:
                    args[-1] = float(args[-1])
                except:
                    pass
                self.sendOsc(target,path,args)
                    
                    
    def toggleFullscreen(self,e):
        if e == '1':
            self.window.fullscreen()
        else:
            self.window.unfullscreen()
            
    def sendOsc(self,target,path,args):
        if ' ' in target:
            for i in range(len(target.split(' '))):
                 _liblo.send('osc.udp://'+target[i], path, *args)
        else:
            _liblo.send('osc.udp://'+target, path, *args)
   
    def receiveOsc(self,a):
        self.async_gtk_msg(self.browser.execute_script)('receiveOsc("'+','.join(a)+'")')
        
    def alertError(self,error):
        self.async_gtk_msg(self.browser.execute_script)('alert("'+error+'")')

    def async_gtk_msg(self, fun):

        def worker((function, args, kwargs)):
            apply(function, args, kwargs)

        def fun2(*args, **kwargs):
            gobject.idle_add(worker, (fun, args, kwargs))

        return fun2

    @_liblo.make_method(None, None)
    def oscIn(self, path, args):
        a = []
        a.append(path)
        for i in range(len(args)):
            a.append(str(args[i])) 
        self.receiveOsc(a)
    
# Utility : oscRouter routes incomming osc messages using a path patch and eventually a parameter patch
# port         path          args       >>       port                          path                      arg
# 3334  /appname/parameter  name  value >>  pathPath[name][1] /pathPatch[name][0]/paramPatch[parameter] value
# pathPatch = { 
#    'name':['/osc/path',target_port]
# }    
class oscRouter(object):
    def __init__(self, port=3334, pathPatch=None, paramPatch=None):
        self.port = port
        self.pathPatch = pathPatch
        self.paramPatch = paramPatch
        
        if self.pathPatch == None:
          raise Exception('No path patch provided for osc routing')

    def start(self):
        if self.port is not None:
            self.server = _liblo.ServerThread(self.port)
            self.server.register_methods(self)
            self.server.start()

    def stop(self):
        if self.port is not None:
            self.server.stop()
            del self.server

    @_liblo.make_method(None, 'sf')
    def routeosc(self, path, args):
        
            param = path.split('/')[-1]
            
            strip, value = args
            
            target_path, target_address = self.pathPatch[strip]
            target_address = target_address.split(' ')
            
            if self.pathPatch != None:                
              target_param = '/' + self.paramPatch[param]
            else:
              target_param = ''
            
            for i in range(len(target_address)):
              #print target_address[i]
              _liblo.send('osc.udp://'+target_address[i], target_path +target_param, args[1])            
