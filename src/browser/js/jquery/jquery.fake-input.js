;(function ($) {
    $.fn.fakeInput = function(options) {

        var settings = $.extend({
            align:'left'
        }, options );

		var self= this,
			canvas = $('<canvas></canvas>').appendTo(self),
			ctx = canvas[0].getContext('2d')

		self.value = undefined
		self.height = undefined
		self.width = undefined
		self.color = undefined
        self.center = settings.align == 'center'

		self.attr('tabindex',"0")

		canvas.resize(function(e,width,height){

			var width = width*2,
				height = height*2

			if (height==100 && width==100 || !width) return

            self.color = getComputedStyle(canvas[0]).getPropertyValue("--color-text")
			self.height=height
			self.width=width

			canvas[0].setAttribute('width',width)
			canvas[0].setAttribute('height',height)

			self.val(self.value)
		})

		self.val = function(newVal) {
			if (newVal==undefined) return self.value

			self.value = newVal

			if (!self.height || !self.width || (self.height==100 && self.width==100)) return

			ctx.clearRect(0,0,self.width,self.height)
			ctx.font =  PXSCALE * 2 * 12 + 'px Droid Sans'
			ctx.textBaseline = "middle"
			ctx.fillStyle = self.color

            if (self.center) {
                ctx.textAlign = settings.align
                ctx.fillText(newVal,self.width/2,this.height/2)
            } else {
                ctx.fillText(newVal,0,this.height/2)
            }


		}

		self.on('focus',function(){
			self.attr('tabindex','-1')
			var i = $('<input></input>')
					.prependTo(self)
					.val(self.value)
					.focus()
					.change(function(){
						self.val($(this).val())
                        i.blur()
					})
			i.blur(function(){
					self.attr('tabindex','0')
					i.remove()
                    $(document).off('.fakeInput')
			})
			$(document).on('touchstart.fakeInput mousedown.fakeInput',function(e){
                if (e.originalEvent.target!=i[0]) {
                    i.blur()
                }
			}).on('keydown.fakeInput', function(e){
                if (e.keyCode==13) i.change()
                if (e.keyCode==27) i.off('change').blur()
            })

		})

		return self

    }
})(jQuery)
