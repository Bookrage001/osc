module.exports = (element, callback)=>{

    var lastTapTime = 0,
        lastTapX,
        lastTapY,
        touchId

    element.on('fake-click',(e, d)=>{

        var tapTime = new Date().getTime()
        var tapLength = tapTime - lastTapTime

    	if (
            
            tapLength < DOUBLE_TAP_TIME && touchId == d.identifier &&
            Math.abs(lastTapX - d.pageX) < 20 &&
            Math.abs(lastTapY - d.pageY) < 20

        ) {

            callback()
            lastTapTime = 0

        } else {

            lastTapTime = tapTime
            touchId = d.identifier
            lastTapX = d.pageX
            lastTapY = d.pageY

        }

    })

}
