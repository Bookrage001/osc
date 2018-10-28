var cpr = require('cpr'),
    path = require('path'),
    files = [
        ['../resources/images/logo-nobadge.png', '../app/assets/favicon.png'],
        ['../resources/images/logo.png', '../app/assets/logo.png'],
        ['../LICENSE', '../app/LICENSE'],
    ]

for (var i in files) {
    cpr(...files[i].map(f => path.resolve(__dirname + '/' + f)), {})
}
