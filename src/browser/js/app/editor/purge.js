var {widgetManager} = require('../managers')

module.exports = function(purgetabs) {

    // prune tabs store
    var count, newcount, formerBuffuredTabs, bufferedTabs

    if (purgetabs) {
        while (true) {
            // we need to do that several times since tabs are referenced in each of their parents

            // get all buffered tabs
            formerBuffuredTabs = []
            for (i in TABS) {
                formerBuffuredTabs.push(TABS[i].tab[0])
            }

            // remove deleted tabs that are not referenced (have no navigation link pointing to them)
            var $f = $(formerBuffuredTabs)
            for (i in TABS) {
                if (!($f.find(`[data-tab="${i}"]`).length || i== '#container')) {
                    delete TABS[i]
                }
            }

            newcount = Object.keys(TABS).length
            if (count == newcount) break
            count = newcount

        }
    }


    bufferedTabs = []
    for (i in TABS) {
        bufferedTabs.push(TABS[i].tab[0])
    }

    // prune widget stores
    // if widgets cannot be found in buffered tabs, it must be unreferenced
    var $b = $(bufferedTabs)
    for (hash in widgetManager.widgets) {
        if (!$b.find(widgetManager.widgets[hash].widget).length) {
            widgetManager.removeWidget(hash)
        }
    }
    widgetManager.purge()

}
