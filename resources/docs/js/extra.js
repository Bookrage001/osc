$(document).ready(function(){
    $.getJSON('https://api.github.com/repos/jean-emmanuel/open-stage-control',function(data){
        $('#github-stars').text(data.stargazers_count)
    })
    $.getJSON('https://api.github.com/repos/jean-emmanuel/open-stage-control/tags',function(data){
        $('#github-version').text(data[0].name)
    })
})
