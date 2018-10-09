var locales = {
    debug: {/* empty */},
    en: require('./en'),
    fr: require('./fr'),
    ru: require('./ru')
}

var lang = locales[LANG] ? LANG : 'en'

module.exports = key=>locales[lang][key] || `<em class='translation-missing'>${key}</em>`
