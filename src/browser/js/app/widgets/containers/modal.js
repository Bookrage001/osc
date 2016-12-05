var {Panel} = require('./panel')

module.exports.options = {
	type:'modal',
	id:'auto',

	separator1:'style',

	label:'auto',
	left:'auto',
	top:'auto',
	width:'auto',
	height:'auto',
	scroll:true,
	color:'auto',
	css:'',

	separator2:'chilren',

	widgets:[],
	tabs:[]
}

var Modal = module.exports.Modal = function(widgetData, container) {

	Panel.apply(this,arguments)

	this.container = container

	container.append('<div class="light"></div>')
	this.light = container.find('.light').first()

	this.modal = this.widget.detach()

	this.value = false

	this.light.on('fake-click',()=>{
		this.setValue(!this.value)
	})

	this.widget.setValue = this.setValue.bind(this)
	this.widget.getValue = ()=>{
		return this.value
	}

}

Modal.prototype = Object.create(Panel.prototype)

Modal.prototype.constructor = Modal

Modal.prototype.setValue = function(v) {
	if (v) {
		this.container.addClass('on')
		this.widget.addClass('on')
		this.light.addClass('on')
		this.value = true
	} else {
		this.container.removeClass('on')
		this.widget.removeClass('on')
		this.light.removeClass('on')
		this.value = false
	}
}

module.exports.create = function(widgetData, container) {
    var modal = new Modal(widgetData, container)
    return modal.widget
}
