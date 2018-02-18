var {app, Menu, shell, dialog} = require('electron'),
    settings = require('./settings'),
    path = require('path'),
    infos = require('../package.json')

app.commandLine.appendSwitch('--touch-events')

if (settings.read('noVsync') || (!settings.cli && settings.read('argv')['disable-vsync'])) {
    app.commandLine.appendSwitch('--disable-gpu-vsync')
}

if (settings.read('noGpu') || (!settings.cli && settings.read('argv')['disable-gpu'])) {
    app.disableHardwareAcceleration()
}

var template = [{
    label: 'Edit',
    submenu: [
        {role: 'undo', accelerator: "CmdOrCtrl+Z"},
        {role: 'redo', accelerator: "Shift+CmdOrCtrl+Z"},
        {type: 'separator'},
        {role: 'cut', accelerator: "CmdOrCtrl+X"},
        {role: 'copy', accelerator: "CmdOrCtrl+C"},
        {role: 'paste', accelerator: "CmdOrCtrl+V"}
    ]
}]

if (process.platform === 'darwin') {
    // Add app menu (OS X)
    template.unshift({
        label: settings.read('appName'),
        submenu: [
            {
                label: 'Hide ' + infos.productName,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            },
            {
                label: 'Show All',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: () => app.quit()
            }
        ]
    })
    template.push(
        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Bring All to Front',
                    role: 'front'
                }
            ]
        },
        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'Documentation',
                    click: () => shell.openExternal(infos.homepage)
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Report an Issue',
                    click: () => shell.openExternal(infos.repository.url + '/issues')
                }
            ]
        }
    )
}

app.on('before-quit',()=>{
    process.exit()
})

app.on('ready',()=>{
    var menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

module.exports = app
