if (!Object.values) {

    Object.values = function(e){
        return Array.prototype.map.call(Object.keys(e), function(t,r){return e[t]})
    }

}

if (!NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach
}
