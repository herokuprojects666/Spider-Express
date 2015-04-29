define(['underscore', 'helpers'], function(_, helper) {

	var adjustCircles = function(ele, x, y, radius, direction, context, pattern) {
		context.beginPath()
		context.arc(x, y, radius, 0, 2 * Math.PI, true)
      	context.fillStyle = pattern;
      	context.fill();
		var object = helper.createObject(ele, {'currentX' : x, 'currentY' : y, 'direction' : direction, 'radius' : radius})
		return _.extend(this.svgElements, object)
	}
	// var createCircles = function() {
	// 	var HTML = ''
	// 	var list = _.each(this.svgElements, function (ele, index) {
	// 		var radius = helper.randomNumber(100, 10, 30)
	// 		HTML += '<circle id="' + index + '" cx="' + ele.currentX + '" cy="' + ele.currentY + '" r="' + radius + '" fill="url(#flowers)"></circle>'
	// 	})
	// 	$('#animation').html(HTML)
	// }

	var determineDirection = function (value, elem, context, pattern) {
		var direction = _.reduce(this.directions, function (memo, ele, index) {
			var object = helper.createObject(index, ele)
			return index == value ? _.extend(memo, object) : memo
		}, {})
		var currentLocation = _.reduce(this.svgElements, function (memo, ele, index) {
			var object = helper.createObject(index, ele)
			return index == elem ? _.extend(memo, object) : memo
		}, {})
		return moveElement.call(this, _.first(_.values(direction)), _.first(_.values(currentLocation)), elem, context, pattern)
	}

	var initiate = function() {
        var height,svg,el,ele,path,width,timeout,pageWidth;
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
    }

	var moveElement = function(direction, current, elem, context, pattern) {
		var width = parseFloat($('#indexAnimation').css('width'))
		var height = parseFloat($('#indexAnimation').css('height'))
		var cX = current.currentX
		var cY = current.currentY
		var radius = current.radius

		if (current.currentX - radius + direction.nextX <= 50) {
			return adjustCircles.call(this, elem, cX + direction.x, cY + direction.y, current.radius, direction.opposite, context, pattern)
		} else if (current.currentY + radius + direction.nextY + 70>= height){
			if (direction.default == 'down_right' && current.currentX + radius + direction.nextX < width)
				return adjustCircles.call(this, elem, cX + direction.x, cY + direction.y, current.radius, direction.opposite, context, pattern)
			return adjustCircles.call(this, elem, cX + direction.altX, cY + direction.altY, current.radius, direction.alt, context, pattern)
		} else if (current.currentY - radius + direction.nextY <= 10) {
			if (direction.default == 'up_left')
				return adjustCircles.call(this, elem, cX + direction.altX, cY + direction.altY, current.radius, direction.alt, context, pattern)
			return adjustCircles.call(this, elem, cX + direction.x, cY + direction.y, current.radius, direction.opposite, context, pattern)
		} else if (current.currentX + radius + direction.nextX >= width)
			return adjustCircles.call(this, elem, cX + direction.altX, cY + direction.altY, current.radius, direction.alt, context, pattern)
		else
			return adjustCircles.call(this, elem, cX + direction.nextX, cY + direction.nextY, current.radius, direction.default, context, pattern)
	}

	var initialDirections = function () {
		var directionArray = _.map(this.directions, function (ele, index) {
			return index
		})
		_.each(this.svgElements, function (ele) {
			var random = helper.randomNumber(4, 0, 4)
			return _.extend(ele, {'direction' : directionArray[random]})
		})
	}

	var startAnimation = function() {
		var canvas = document.getElementById('indexAnimation')
		canvas.width = +$(window).width()
		canvas.height = +$(window).height()
		var c = canvas.getContext('2d')
		var image = document.getElementById('canvasImage')
		var pattern = c.createPattern(image, 'repeat')

		var animation = function (context, c) {
			return window.requestAnimationFrame (function() {
				c.clearRect(0, 0, canvas.width, canvas.height)
				_.each(context.svgElements, function (ele, index) {
					switch(ele.direction) {
						case 'up_right' :
						return determineDirection.call(context, 'up_right', index, c, pattern)
						break;
						case 'up_left' :
						return determineDirection.call(context, 'up_left', index, c, pattern)
						break;
						case 'down_right' :
						return determineDirection.call(context, 'down_right', index, c, pattern)
						break;
						case 'down_left' :
						return determineDirection.call(context, 'down_left', index, c, pattern)
						break;
					}
				})
				return setTimeout(animation, 1, context, c, pattern)
			}, 1, this, c)
		}
		return animation.call(this, this, c, pattern)
	}
	return {
		initialDirections : initialDirections,
		initiate, initiate,
		startAnimation : startAnimation
	}
})