define([''], function () {
    var height,svg,el,ele,path,width,timeout,pageWidth;
    return (function() {
    	console.log($(window).width())
        height = $(window).height() + $('html body').scrollTop() - 50
        width = $(window).width() - 50
        alt = $(window).height() + $('html body').scrollTop() 
        svg = document.getElementById('SVG')    
        el = document.getElementById('clipped')     
        ele = document.getElementById('svgMenu')
        // path = 'M50,' + alt + ' A50,50 0 1,0 0,' + alt + ' z'
        path = 'M50,' + height + ' A25,50 0 0,1 0,' + height + ' L0,50 ' + 'Q0,25 50,25 L100,25 Q125,0 150,0 L800,0 Q 825,0 850,25 L' + width + ',25 A50,25 0 0,1 ' + width + ',50 A50,25 0 0,1 ' + width + ',75 L50,75'
        svg.style.height = height + 50
        el.setAttribute('d', path)
        ele.style.height = '100%' 
    }.call(this))
})


//     $(this).on('mousedown', window, function(e) {
//     	width = $(window).width()
//     	if (e.pageX >= width) {
//     		return (function timer() {
//     			timeout = window.setTimeout(function() {
    				   				
//     				$(document).on('mousedown', function(e) {
//     					pageWidth = e.pageX
// 					})

// 	    			height = $(window).height() + $('html body').scrollTop()   
// 	    			path = 'M0,' + height + ' L0,0 L50,0 L50,' + height +'z'   		
// 					svg.style.height = height
// 					el.setAttribute('d', path)
// 	    			ele.style.height = '100%'
// 	    			return pageWidth <= width ? window.clearTimeout(timeout) : timer()
//     			}, 1)
//     		}.call(null))
//     	}
//     })
// })