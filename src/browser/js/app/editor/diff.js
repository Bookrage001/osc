module.exports = {

    diff: require('jsondiffpatch'),

    diffToWidget: function(widget, diff) {

        var children = diff.tabs ||diff.widgets

        if (children) {
            var childrenKeys = Object.keys(children),
                deletedChildren = childrenKeys.filter(x => typeof x === 'string' && x.match(/_[0-9]+/)),
                changedChildren = childrenKeys.filter(x => !isNaN(x))
        }

        if (
            !children ||
            Array.isArray(children) ||
            deletedChildren.length ||
            changedChildren.length !== 1

        ) {
            return [widget, diff]
        }

        return module.exports.diffToWidget(widget.children[changedChildren[0]], children[changedChildren[0]])

    }

}
