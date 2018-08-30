// Dirty browser window shim

document = {
    createElementNS: x=>[],
    addEventListener: ()=>{},
    createRange: ()=>{
        return {
            createContextualFragment:()=>{return {
                firstChild: {
                    querySelectorAll: x=>[]
                }
            }},
            selectNode: ()=>{}
        }
    }
}

window = {
    addEventListener: ()=>{},
    location: {},
    document: document,
    navigator: {},
    NodeList: Array,
    WebSocket: Object
}

Object.assign(global, window)

// Required globals

DOM = require('../src/browser/js/app/dom')
DOM.init()
CANVAS_FRAMERATE = 1
LANG = 'en'

// Here we go

var widgets = require('../src/browser/js/app/widgets'),
    base = require('../src/browser/js/app/widgets/common/widget').defaults(),
    doc = ''


doc += '\n\n'
doc += '## Generic properties'
doc += '\n\n'

doc += '| property | type |default | description |'
doc += '\n'
doc += '| --- | --- | --- | --- |'

for (var propName in base) {

    var prop = base[propName],
        permalink = propName

    if (propName === '_props' || propName[0] === '_') continue

    var help = Array.isArray(prop.help) ? prop.help.join('<br/><br/>').replace(/<br\/>-/g, '-') : prop.help || ''

    doc += '\n'
    doc += `| <h4 id="${permalink}">${propName}<a class="headerlink" href="#${permalink}" title="Permanent link">¶</a></h4> | \`${prop.type.replace(/\|/g,'\`\\|<br/>\`')}\` | <code>${(JSON.stringify(prop.value, null, '&nbsp;') || '').replace(/\n/g,'<br/>')}</code> | ${help} |`

}


for (var k in widgets.categories) {
    var category = widgets.categories[k]

    doc += '\n\n'
    doc += '## ' + k

    for (var kk in category) {
        var type = category[kk],
            defaults = widgets.widgets[type].defaults()

        doc += '\n\n'
        doc += '### ' + type
        doc += '\n\n'

        doc += '| property | type |default | description |'
        doc += '\n'
        doc += '| --- | --- | --- | --- |'

        for (var propName in defaults) {

            var prop = defaults[propName],
                permalink = type + '_' + propName

            if (propName === '_props' || propName[0] === '_' || JSON.stringify(prop) == JSON.stringify(base[propName])) continue

            var help = Array.isArray(prop.help) ? prop.help.join('<br/><br/>').replace(/<br\/>-/g, '-') : prop.help || ''

            doc += '\n'
            doc += `| <h4 id="${permalink}">${propName}<a class="headerlink" href="#${permalink}" title="Permanent link">¶</a></h4> | \`${prop.type.replace(/\|/g,'\`\\|<br/>\`')}\` | <code>${(JSON.stringify(prop.value, null, '&nbsp;') || '').replace(/\n/g,'<br/>')}</code> | ${help} |`

        }

    }
}

console.log(doc)
