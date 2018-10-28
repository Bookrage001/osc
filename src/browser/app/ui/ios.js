// Prevent iOS Pull-To-Refresh

var iOS

if (navigator.platform.match(/iPhone|iPod|iPad/)) {

    iOS = true

    var preventNextMove = false

    document.addEventListener('touchstart', (e)=>{
        if (e.touches.length === 1 && !e.target._drag_widget) preventNextMove = true
    }, false)

    document.addEventListener('touchmove', (e)=>{
        // preventDefault the first overscrolling touchmove
        if (preventNextMove) {
            preventNextMove = false
            e.preventDefault()
        }
    }, false)

}

module.exports = iOS
