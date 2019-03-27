var sass = require('node-sass'),
    path = require('path'),
    fs = require('fs')

var result = sass.renderSync({
    file: path.resolve(__dirname + '/../src/scss/styles.scss'),
    outFile: path.resolve(__dirname + '/../theme/styles.css'),
    outputStyle: 'compressed',
    sourceMap: false
})

fs.writeFileSync(path.resolve(__dirname + '/../theme/styles.css'), result.css)
