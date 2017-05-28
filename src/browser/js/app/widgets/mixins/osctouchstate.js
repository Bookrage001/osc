module.exports = (self, element)=>{

    self._touched = 0
    element.on('draginit',(e)=>{
        self._touched += 1
        if (self._touched == 1)
            self.sendValue({
                address:self.widgetData.touchAddress,
                v:1,
                split:false
            })
    })
    
    element.on('dragend', (e, data, traversing)=>{
        if (self._touched == 1) {
            self._touched = 0
            self.sendValue({
                address:self.widgetData.touchAddress,
                v:0,
                split:false
            })
        } else if (self._touched > 1){
            self._touched -= 1
            if (traversing) self._touched = 1
        }
    })

}
