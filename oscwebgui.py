#!/usr/bin/env python
#encoding=utf8
"""
Osc Web Gui
Build your own OSC control gui with html/css/javascript !

# Partial doc... check the example !

>>> import oscwebgui
>>> gui = oscWebGui(html='/path/to/gui.html')
>>> gui.main()

Parameters :
  port,       input port for external control of the gui
  target,     target_ip:target_port to send osc messages to, multiples targets can be specified, separated by a space
  appName,    name of the gui window, prefix for osc messages
  presetName, user values can be saved by the gui in presetName.preset
  html,       path to the html gui
  
Html Gui:

- Build your html page like any other (including css stylesheets and javascript)
- You can communicate with the gui engine by changing the document's title (document.title = newtitle), here are the recognized instructions :
  - 'param, name, value' will send this osc message to the target(s) : '/appName/param name value' #value must be a number, it is converted to float anyway
  - 'Save, preset' will store the preset in presetName.preset, preset must be of the form 'param name value;param name value;'
  - 'Load' will recall values stored in presetName.preset and send osc messages for each value
  
  
- The html gui must contain the following javascript function (not wrapped in a document.ready() function) :
  - setValue(param, name, value)  : this is required for preset loading and for external osc control, and must be adapted to the gui's elements

"""
import gtk, webkit, gobject, liblo as _liblo

class oscWebGui(object):
    def __init__(self,port=3333, target='127.0.0.1:3334', appName='oscWebGui', presetName='oscWebGui', html=None):
        
        self.port = port
        self.target = target.split(' ')
        self.appName = appName
        self.presetName = presetName
        self.html = html
        
        if self.html == None:
          raise Exception('You must specify the absolute path to the html gui file')

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

        self.window.set_default_size(800, 600)
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
            if title.split(',')[0] == 'Load':
                try:
                    f = open(self.presetName+'.preset','r')
                except:
                    self.alertError(self.presetName+'.preset'+' not found !')
                    return
                preset = f.read().split('\n')
                for i in range(len(preset)-1):
                    self.sendOsc('/'+preset[i].split(' ')[0],preset[i].split(' ')[1],float(preset[i].split(' ')[2]))
                    self.setValue(preset[i].split(' ')[0],preset[i].split(' ')[1],float(preset[i].split(' ')[2]))

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
            else:
                param = title.split(',')[0]
                name = title.split(',')[1]
                value = float(title.split(',')[2])
                self.sendOsc(param,name,value)
                    
                    
    def toggleFullscreen(self,e):
        if e == '1':
            self.window.fullscreen()
        else:
            self.window.unfullscreen()
            
    def sendOsc(self,param,name,value):
        path = '/' + self.appName + '/' + param
        for i in range(len(self.target)):
            _liblo.send('osc.udp://'+self.target[i], path, name, value)
   
    def setValue(self,param,name,value):
        self.async_gtk_msg(self.browser.execute_script)('setValue("'+param+'","'+name+'",'+str(value)+')')
        
    def alertError(self,error):
        self.async_gtk_msg(self.browser.execute_script)('alert("'+error+'")')

    def async_gtk_msg(self, fun):

        def worker((function, args, kwargs)):
            apply(function, args, kwargs)

        def fun2(*args, **kwargs):
            gobject.idle_add(worker, (fun, args, kwargs))

        return fun2

    @_liblo.make_method(None, 'sf')
    def oscIn(self, path, args):
        if '/'+self.appName in path:
            param = path.split('/')[-1]
            name = args[0]
            value = args[1]
            self.setValue(param,name,value)
    
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
              _liblo.send('osc.udp://'+target_address[i], target_path +target_param, args[1])            
