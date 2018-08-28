// Prevent iOS Pull-To-Refresh

if (navigator.platform.match(/iPhone|iPod|iPad/)) {

    var preventNextMove = false

    document.addEventListener('touchstart', (e)=>{
        if (e.touches.length === 1 && !e.target._drag_widget) preventNextMove = (window.pageYOffset === 0)
    }, false)

    document.addEventListener('touchmove', (e)=>{
        // preventDefault the first overscrolling touchmove
        if (preventNextMove) {
            preventNextMove = false
            e.preventDefault()
        }
    }, false)

}
