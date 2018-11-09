if (!NodeList.prototype.forEach) {

    NodeList.prototype.forEach = Array.prototype.forEach

}

if (!HTMLCollection.prototype.forEach) {

    HTMLCollection.prototype.forEach = Array.prototype.forEach

}
