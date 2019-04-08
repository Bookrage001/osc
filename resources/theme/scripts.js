function getOffset(element) {
    var offset = 0
    if (element) {
        do {
            if (!isNaN(element.offsetTop)) {
                offset += element.offsetTop - element.scrollTop
            }
        } while ((element = element.offsetParent))
    }

    return offset
}

var navHeight = 80
function offsetScroll(){
    if (document.location.hash) {
        var el = document.getElementById(document.location.hash.substring(1))
        if (el) document.body.scrollTop = document.documentElement.scrollTop = getOffset(el) - navHeight
    }
}
window.addEventListener('hashchange', offsetScroll)
setTimeout(offsetScroll, 250)


var mobileToggle = document.getElementById('mobile-toggle'),
    mobileMenu = document.getElementById('menu'),
    show = false

function toggleMenu(s){
    show = s === undefined ? !show : s
    mobileToggle.classList.toggle('show', show)
    mobileMenu.classList.toggle('show', show)
}

mobileToggle.addEventListener('click', function(){
    toggleMenu()
})

document.addEventListener('click', function(e){
    if (!mobileToggle.parentNode.contains(e.target)) {
        toggleMenu(false)
    }
})
