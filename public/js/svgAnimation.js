define(['underscore', 'helpers'], function(_, helper) {

	var adjustCircles = function(ele, width, height, direction) {
		$(ele).attr('cx', width)
		$(ele).attr('cy', height)
		var id = $(ele).attr('id')
		var object = helper.createObject(id, {'currentX' : +$(ele).attr('cx'), 'currentY' : +$(ele).attr('cy'), 'direction' : direction})
		return _.extend(this.svgElements, object)
	}
	var createCircles = function() {
		var HTML = ''
		var list = _.each(this.svgElements, function (ele, index) {
			var radius = helper.randomNumber(100, 10, 30)
			HTML += '<circle id="' + index + '" cx="' + ele.currentX + '" cy="' + ele.currentY + '" r="' + radius + '" fill="url(#flowers)"></circle>'
		})
		$('#animation').html(HTML)
	}

	var determineDirection = function (value, elem) {
		var ele = $('#' + elem)
		var direction = _.reduce(this.directions, function (memo, ele, index) {
			var object = helper.createObject(index, ele)
			return index == value ? _.extend(memo, object) : memo
		}, {})
		var currentLocation = _.reduce(this.svgElements, function (memo, ele, index) {
			var object = helper.createObject(index, ele)
			return index == elem ? _.extend(memo, object) : memo
		}, {})
		var radius = +$(ele).attr('r')
		return moveElement.call(this, _.first(_.values(direction)), _.first(_.values(currentLocation)), radius, ele)
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

	var moveElement = function(direction, current, radius, elem) {
		var width = parseFloat($('#indexAnimation').css('width'))
		var height = parseFloat($('#indexAnimation').css('height'))
		var id = $(elem).attr('id')
		var cX = +$(elem).attr('cx')
		var cY = +$(elem).attr('cy')

		if (current.currentX - radius + direction.nextX <= 50) {
			return adjustCircles.call(this, elem, cX + direction.x, cY + direction.y, direction.opposite)
		} else if (current.currentY + radius + direction.nextY + 70>= height){
			if (direction.default == 'down_right' && current.currentX + radius + direction.nextX < width)
				return adjustCircles.call(this, elem, cX + direction.x, cY + direction.y, direction.opposite)
			return adjustCircles.call(this, elem, cX + direction.altX, cY + direction.altY, direction.alt)
		} else if (current.currentY - radius + direction.nextY <= 10) {
			if (direction.default == 'up_left')
				return adjustCircles.call(this, elem, cX + direction.altX, cY + direction.altY, direction.alt)
			return adjustCircles.call(this, elem, cX + direction.x, cY + direction.y, direction.opposite)
		} else if (current.currentX + radius + direction.nextX >= width)
			return adjustCircles.call(this, elem, cX + direction.altX, cY + direction.altY, direction.alt)
		else
			return adjustCircles.call(this, elem, cX + direction.nextX, cY + direction.nextY, direction.default)
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
		var animation = function (context) {
			return setTimeout(function() {
				_.each(context.svgElements, function (ele, index) {
					switch(ele.direction) {
						case 'up_right' :
						return determineDirection.call(context, 'up_right', index)
						break;
						case 'up_left' :
						return determineDirection.call(context, 'up_left', index)
						break;
						case 'down_right' :
						return determineDirection.call(context, 'down_right', index)
						break;
						case 'down_left' :
						return determineDirection.call(context, 'down_left', index)
						break;
					}
				})
				return setTimeout(animation, 1, context)
			}, 1, this)
		}
		return animation.call(this, this)
	}
	return {
		createCircles : createCircles,
		initialDirections : initialDirections,
		initiate, initiate,
		startAnimation : startAnimation
	}
})