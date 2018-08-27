var locales = {
    en: require('./en'),
    fr: require('./fr')
}

var lang = locales[LANG] ? LANG : 'en'

module.exports = key=>locales[lang][key] || `<em class="translation-missing">${key}</em>`
