var locales = {
    en: require('./en')
}

var lang = locales[LANG] ? LANG : 'en'

module.exports = key=>locales[lang][key] || `<em class="translation-missing">${key}</em>`
