var cp = require('cp'),
    path = require('path'),
    files = [
        ['../resources/images/logo-nobadge.png', '../app/browser/favicon.png'],
        ['../resources/images/logo.png', '../app/browser/logo.png']
    ]

for (var i in files) {
    cp.sync(...files[i].map(f => path.resolve(__dirname + '/' + f)))
}
