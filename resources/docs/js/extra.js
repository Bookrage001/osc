$(document).ready(function(){
    $.getJSON('https://api.github.com/repos/jean-emmanuel/open-stage-control',function(data){
        $('#github-stars').text(data.stargazers_count)
    })
    $.getJSON('https://raw.githubusercontent.com/jean-emmanuel/open-stage-control/master/app/package.json',function(data){
        $('#github-version').text('v'+data.version)
    })
})
