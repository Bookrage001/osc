var widgetManager = require('../managers/widgets')

module.exports = function(hashes) {
    // prune widget stores
    for (let i in hashes) {
        if (
            widgetManager.widgets[hashes[i]]
        ) {
            widgetManager.removeWidget(hashes[i])
        }
    }
    widgetManager.purge()

}
