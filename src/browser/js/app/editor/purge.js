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
    for (i in WIDGETS) {
        for (var j=WIDGETS[i].length-1;j>=0;j--) {
            if (!$b.find(WIDGETS[i][j]).length) {
                WIDGETS[i].splice(j,1)
            }
        }
        if (!WIDGETS[i].length) {
            delete WIDGETS[i]
        }
    }
    for (i in WIDGETS_LINKED) {
        for (var j=WIDGETS_LINKED[i].length-1;j>=0;j--) {
            if (!$b.find(WIDGETS_LINKED[i][j]).length) {
                WIDGETS_LINKED[i].splice(j,1)
            }
        }
        if (!WIDGETS_LINKED[i].length) {
            delete WIDGETS_LINKED[i]
        }
    }
    for (i in WIDGETS_BY_ADDRESS) {
        for (var j=WIDGETS_BY_ADDRESS[i].length-1;j>=0;j--) {
            if (!$b.find(WIDGETS_BY_ADDRESS[i][j]).length) {
                WIDGETS_BY_ADDRESS[i].splice(j,1)
            }
        }
        if (!WIDGETS_BY_ADDRESS[i].length) {
            delete WIDGETS_BY_ADDRESS[i]
        }
    }
}
