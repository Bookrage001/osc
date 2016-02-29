var actions = require('./actions'),
	icon = require('./utils').icon

var data = [
    {
        actions: [
            {
                title:'Fullscreen (F11)',
                action:actions.toggleFullscreen
            }

        ]
    },
	{
		title: icon('sliders') + '&nbsp; State',
		actions: [
			{
				title:'Store',
				action:actions.stateQuickSave
			},
			{
				title:'Recall',
				action:actions.stateQuickLoad,
				class:'disabled quickload'
			},
			{
				title:'Send All',
				action:actions.stateSend
			},
			{
				title:'Import',
				action:actions.stateLoad
			},
			{
				title:'Export',
				action:actions.stateSave
			}
		]
	},
	{
		title: icon('edit') + '&nbsp; Editor',
		class:'editor',
		actions: [
			{
				title:'On',
				action:actions.editorEnable,
				class:'enable-editor'
			},
			{
				title:'Off',
				action:actions.editorDisable,
				class:'on disable-editor'
			},
			{
				title:'Root',
				class:'editor-root disabled'
			},
			{
				title:'Load',
				action:actions.sessionBrowse
			},
			{
				title:'Save',
				action:actions.sessionSave
			}
		]
	},
]

var sidepanel = function(data){

	var bindAction = function(el,callback) {
		el.click(function(){callback()})
	}

	var  html = $('<ul id="options"></ul>')

	for (i in data) {
		var itemData = data[i]

		var item = $('<li></li>'),
			inner = $('<div></div>').appendTo(item)
			wrapper = $('<div class="actions"></div>').appendTo(inner)

		if (itemData.title) $('<div class="title">'+itemData.title+'</div>').prependTo(inner)
		if (itemData.class) inner.attr('class',itemData.class)

		for (j in itemData.actions) {
			var actionData = itemData.actions[j]
			var el = $('<a class="btn">'+actionData.title+'</a>').appendTo(wrapper)
			if (actionData.action) bindAction(el, actionData.action)

			if (actionData.class) el.addClass(actionData.class)

		}
		item.appendTo(html)

	}

	return html

}(data)

module.exports = function() {

	$('#sidepanel').append(sidepanel)

	$(`<a id="open-toggle">${icon('navicon')}</a>`).appendTo('#container').click(function(){
        $('#open-toggle, #sidepanel, #container').toggleClass('sidepanel-open')
    })

    // in case where are hot loading a session
    if ($('#sidepanel').hasClass('sidepanel-open')) {
        $('#open-toggle, #container').addClass('sidepanel-open')
    }

}
