var cpr = require('cpr'),
    fs = require('fs'),
    path = require('path'),
    files = [
        ['../resources/images/logo-nobadge.png', '../app/assets/favicon.png'],
        ['../resources/images/logo.png', '../app/assets/logo.png'],
        ['../LICENSE', '../app/LICENSE'],
    ]

for (var i in files) {
    cpr(...files[i].map(f => path.resolve(__dirname + '/' + f)), {})
}


var packageJson = require('../package.json'),
    appJson = {},
    copiedProps = [
        "name",
        "productName",
        "description",
        "version",
        "author",
        "repository",
        "homepage",
        "license",
        "yargs",
        "engines"
    ]

for (var k of copiedProps) {
    appJson[k] = packageJson[k]
}

appJson.main = appJson.bin = "index.js"
appJson.scripts = {
  "start": "electron index.js",
  "start-node": "node index.js"
}

fs.writeFileSync(path.resolve(__dirname + '/../app/package.json'), JSON.stringify(appJson, null, '  '))
