var offset = 82
function offsetScroll(){
    if (document.location.hash) {
        var el = document.getElementById(document.location.hash.substring(1))
        if (el) document.body.scrollTop = document.documentElement.scrollTop = el.offsetTop - offset
    }
}
window.addEventListener('hashchange', offsetScroll)
setTimeout(offsetScroll, 250)
