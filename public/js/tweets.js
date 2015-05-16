define(['jquery', 'helpers'], function($, helper) {

	//private functions

	var determineDivWidth = function (text, font) {
		var ele = $('<p></p>').append(text)
		var font = font || '16px'
		var div = $('<div></div>').css({'position' : 'absolute', 'top' : '-1000px', 'left' : '-1000px', 'font-size' : '16px'}).append(ele).appendTo($('body'))
		var width = div.width()
		div.remove()
		return width
	}

	var adjustRows = function(determiner, key, data) {
		var user = key || $('.gameboard').attr('id').toLowerCase();
		var data = data || JSON.parse(sessionStorage.getItem(user))
		var rows = $('.detect').length
		var width = this.currentElements
		if(determiner) {
			return _.each($('.detect'), function (ele) {
				return $(ele).children().length == '0' ? $(ele).remove() : 'done adjusting'
			})
		}
		return Math.ceil(data.user.tweets.length / width) >= rows ? $(this.tweetArea).append('<div class="row detect"></div>') : 'done adjusting'
	}

	var determineWidth = function () {
		var width = $(window).width()
		return _.reduce(this.widthIdentifier, function (memo, ele, index, array) {
			return index == array.length -1 && _.isEmpty(memo) ? [].concat.call([], memo, ele['elements']) :
				   index == array.length -1 && !_.isEmpty(memo) ? memo :
				   (ele['width'] <= width) && (width <= array[index+1]['width']) ? [].concat.call([], memo, ele['elements']) :
				   memo
		}, []).join('')
	}

	var grabChildren = function (determiner) {
		return _.map(_.range($('.detect').length), function (ele) {
			return determiner ? $('.detect').eq(ele).children().eq(0) : $('.detect').eq(ele).children().last()
		})
	}

	var switchElement = function(index, element) {
		return $('.detect').eq(index+1).prepend(element)
	}

	var tweetSelectors = function() {
		var children = _.map($(this.tweetArea).children(), function (elem) {
			return _.map($(elem).children(), function (ele) {
				return $(ele).attr('id')
			})
		})
		var selectors = helper.mapSelectors(helper.flatten(children))
		return _.extend(this, {'tweetSelectors' : selectors})
	}

	// public functions

	var addKeys = function(value) {
		return _.extend(this, {'keystrokes' : value})
	}

	var alignImage = function(ele, determiner) {
		var zoomWidth = $(ele).css('zoom') * $(ele).width()
		var zoomHeight = $(ele).css('zoom') * $(ele).height()
		if (zoomWidth != 400) {
			determiner ? $(ele).css({'left' : (275 + parseFloat($(ele).css('left')) - zoomWidth) / 2 }):
						 $(ele).css({'left' : (400 + parseFloat($(ele).css('left')) - zoomWidth) / 2 })
		}
		$(ele).css({'top' : (500 - zoomHeight) / 2 - parseFloat($(ele).css('top'))})
	}

	var animateTweet = function(duration) {
		var that = this
		var tweetOffset = $(this.tempTweet).offset()
		var tweetPosition = $(this.tempTweet).position()
		var totalOffset = helper.createMultiPropObject(['left', 'top'],
			[+tweetOffset['left'], +tweetOffset['top'] + tweetPosition['top']])
		$(this.tempTweet).animate({
			left : -totalOffset['left'] - 100,
			top : -totalOffset['top'] -100,
			opacity : 0
		},
		{
			duration : duration,
			complete : function () {
						$(that.tweetPreview).css('display', 'none'), $(that.tweetFormSVG).empty()
						applyEffect.call(that, that.tweetSelectors, null, 1, that, function () {})
			}
		})


	}

	var applyEffect = function(list, determiner, duration, context, callback) {
		return setTimeout(function (list, determiner, duration, context, callback) {
			if (_.isEmpty(context.list))
				_.extend(context, {'list' : list})
			var ele = _.first(context.list)
			if (determiner)
				return $(ele).fadeOut({
					duration : duration,
					complete : function() {
						_.extend(context, {'list' : _.rest(context.list)})
						adjustOffset.call(context)
						return _.isEmpty(context.list) ? callback.call(context) : applyEffect.call(context, context.list, determiner, duration, context, callback)
					}
				})
			return $(ele).fadeIn({
					duration : duration,
					complete : function() {
						_.extend(context, {'list' : _.rest(context.list)})
						adjustOffset.call(context)
						return _.isEmpty(context.list) ? callback.call(context) : applyEffect.call(context, context.list, determiner, duration, context, callback)
					}
				})
		}, duration, list, determiner, duration, this, callback)
	}

	var adjustOffset = function (context) {
		var that = context || this
		var fakeHeight = _.map($('.detect'), function (ele) {
			return _.map(_.range($(ele).children().length), function (elem) {
				return $(ele).children().eq(elem).children().eq(1).height()
			})
		})
		var flattendHeights = helper.flatten(fakeHeight)
		if (_.contains(flattendHeights, 18)) {
			return setTimeout(function (context) {
				return adjustOffset.call(context, context)
			}, 200, that)
		}
		var maxHeight = _.map($('.detect'), function (ele, index, array) {
			var heights = _.reduce( _.range($(ele).children().length), function (memo, elem){
				var display = $(ele).children().eq(elem).css('display')
				return display != 'none' ? [].concat.call([], memo, +$(ele).children().eq(elem).height()) : memo
				// return +$(ele).children().eq(elem).height()
			}, [])
			var maxHeight = Math.max.apply(null, heights)
			return _.each(_.range($(ele).children().length), function (elem) {
				var height = +$(ele).children().eq(elem).height() - maxHeight
				var previousOffset = index != 0 ? parseFloat($(array[index-1]).children().eq(elem).css('top')) : 0
				$(ele).children().eq(elem).css('top', height + previousOffset + 'px')
			})
		})
		return tweetSelectors.call(that)
	}

	var buildTweet = function(data) {
		hashtagLinks.call(this, data)
		HTML = ''
		HTML += '<div class="row tweet tempTweet">'
		HTML += '<div class="row"><p class="message" id="border">' + data.message_title + '</p></div>'
		HTML += '<div class="row">'
		if(data.image.src != void 0)
			HTML += '<img class="image tweetImage" src="' + data.image.src + '"/>'
		HTML += '</div>'
		HTML += '<div class="row"><p class="message" id="border">' + data.body + '</p></div>'
		HTML += '</div>'
		$(this.tweetPreview).children().eq(1).html(HTML)
		$(this.tweetImage).css({'height' : data.image.height, 'width' : data.image.width})
		var height = $(this.tweetPreview).children().eq(1).children().first().height()
		if (height > 250) {
			recursiveZoom.call(this, $(this.tweetPreview).children().eq(1).children().first(), 250)
		}
		alignImage.call(this, $(this.tweetPreview).children().eq(1).children().first(), true)
		var tweetHeight = $(this.tweetPreview).children().eq(1).children().first().height() * $(this.tweetPreview).children().eq(1).children().first().css('zoom')
		var tweetOffset = parseFloat($(this.tweetPreview).children().eq(1).children().first().css('top'))
		$('#tweetDiv').css('height', +tweetOffset + tweetHeight)
		$(this.tweetBody).val(data.body)
	}

	var buildTable = function(data, key, cb) {
		var data = data || JSON.parse(sessionStorage.getItem(key))
		if (!data.user.tweets)
			return
		var HTML = '';
		var that = this;
		var width = +$(window).width();
		var length = determineWidth.call(this);
		this.currentElements = length
		var string = _.each(_.range(Math.ceil(data.user.tweets.length / length)), function (ele, index, array){
			HTML += '<div class="row detect">'
			var newLength = data.user.tweets.length < length || (1 + index) * length > length ? data.user.tweets.length : ((1 + index) * length);
			_.each(_.range( (index * length), newLength ), function (elem) {
				HTML += '<div class="row tweet" id="tweet' + elem + '">'
				HTML += '<div class="row"><p class="message" id="border">' + data.user.tweets[elem].message_title + '</p></div>'
				HTML += '<div class="row">'
				_.each(data.user.tweets[elem].image_urls, function (e) {
					HTML += '<img class="image" src="' + e + '"/>'
				})
				HTML += '</div>'
				HTML += '<div class="row"><p class="message" id="border">' + data.user.tweets[elem].message_body + '</p></div>'
				HTML += '</div>'
			})
			HTML += '</div>'
		})
		$(this.tweetArea).html(HTML)
		return cb.call(this)
	}

	var construct = function(object) {
		this.intervals = ''
		this.widthIdentifier = [{'width' : 866, 'elements' : 4}, {'width' : 1086, 'elements' : 5}, {'width' : 1306, 'elements' : 6}]
		this.currentElements = []
		object.call(this)
	};

	var createIcon = function(element, svg, parent) {
		var svg = svg || helper.createNSElement('svg',{'position' : 'absolute', 'top' : '13px', 'right' : '3px', 'zIndex' : 20, 'height' : '13px', 'width' : '13px'})
		var lineOne = helper.createNSElement('line', {'x1' : 0, 'x2' : 10, 'y1' : 3, 'y2' : 13, 'stroke' : '#fff', 'strokeWidth' : '3px'})
		var lineTwo = helper.createNSElement('line', {'x1' : 10, 'x2' : 0, 'y1' : 3, 'y2' : 13, 'stroke' : '#fff', 'strokeWidth' : '3px'})
		helper.appendElements(svg, [lineOne, lineTwo])
		$(element).append(svg)
		svg.addEventListener('click', function () {
			return parent ? $(parent).remove() : $(this).parent().remove()
		})
		svg.addEventListener('mouseenter', function () {
			this.style.cursor = 'pointer'
		})
	}

	var createSearchIcon = function(svg, element) {
		var that = this
		var lineOne = helper.createNSElement('line', {'x1' : 0, 'x2' : 10, 'y1' : 0, 'y2' : 10, 'stroke' : '#000', 'strokeWidth' : '3px'})
		var circle = helper.createNSElement('circle', {'r' : 8, 'cx' : 14, 'cy' : 14, 'fill' : '#000'})
		var lineTwo = helper.createNSElement('line', {'x1' : 18, 'x2' : 28, 'y1' : 10, 'y2' : 0, 'stroke' : '#000', 'strokeWidth' : '3px'})
		helper.appendElements(svg, [lineOne, circle, lineTwo])
		$(element).append(svg)
		svg.addEventListener('click', function () {
			return search.call(that)
		})
		svg.addEventListener('mouseenter', function () {
			this.style.cursor = 'pointer'
		})
	}

	var createTweetPreview = function () {
		var hashTagArray = _.map($(this.tweetHashtags).val().split(','), function (ele, index, array) {
			return ele == ' ' && index != 0 && index != array.length - 1 ? '' : ele
		}).join('')
		var hashtagValue = $(this.tweetHashtags).val() == '' ? [] : hashTagArray.split(' ')
		var title = helper.createObject('message_title', $(this.tweetMessageTitle).val())
		var body = helper.createObject('body', $(this.tweetBody).val())
		var hashtags = helper.createObject('hashtags', hashtagValue)
		var image = helper.createObject('image', helper.createMultiPropObject(['src', 'width', 'height'], [$(this.imagePreview).attr('src'),
			parseFloat($(this.imagePreview).css('width'))/2, parseFloat($(this.imagePreview).css('height'))/2]))
		_.extend(this, {'tweetData' : helper.mergeObjects([title, body, hashtags, image])})
		return buildTweet.call(this, this.tweetData)
	}

	var createSearchDivider = function(element) {
		var height = $(window).height() - 75
		var width = $(window).width()
		var path = helper.createNSElement('path', {'d' : 'M0,' + height + ' L0,25 L140,25 L140,0 L' + width + ',0 L' + width + ',35 L140,35 L10,35 L10,' + height })
		var clipPath = helper.createNSElement('clipPath', {'id' : 'searchDivider'})
		var svg = helper.createNSElement('svg', {'position' : 'absolute', 'zIndex' : 20, 'height' : height, 'width' : width, 'left' : '7px'})
		var defs = helper.createNSElement('defs', {})
		var gradient = helper.createNSElement('linearGradient', {'id' : 'blueGradient'})
		var stopOne = helper.createNSElement('stop', {'offset' : .35, 'stop-color' : '#15F'})
		var stopTwo = helper.createNSElement('stop', {'offset' : 1, 'stop-color' : '#AEF'})
		var rect = helper.createNSElement('rect', {'fill' : 'url(#blueGradient)', 'clip-path' : 'url(#searchDivider)', 'position' : 'absolute', 'zIndex' : 25})
		rect.setAttribute('height', height)
		rect.setAttribute('width', width)
		clipPath.appendChild(path)
		gradient.appendChild(stopOne)
		gradient.appendChild(stopTwo)
		defs.appendChild(clipPath)
		defs.appendChild(gradient)
		svg.appendChild(defs)
		svg.appendChild(rect)
		$(element).html(svg)
	}

	var createSearchTerm = function (callback) {
		var determiner = _.reduce(this.keystrokes.split(''), function (memo, ele, index) {
			return index <= 1 ? memo += ele : memo
		}, '')
		var searchPrefix = _.reduce(this.searchPrefixes, function (memo, ele) {
			return ele == determiner ? [].concat.call([], memo, ele) : memo
		}, [])
		if (_.isEmpty(searchPrefix)) {
			$('.errorArea').css('width', determineDivWidth(this.searchError))
			$('.error').html(this.searchError)
			return
		}
		var width = determineDivWidth(this.keystrokes)
		var newString = this.keystrokes.split('')[2] == ' ' ? this.keystrokes.slice(3, this.keystrokes.length) : this.keystrokes.slice(2, this.keystrokes.length)
		var ele = $('<p></p>').append(newString).addClass('message textArea')
		var div = $('<div></div>').append(ele).css('width', width + 20 + 'px').addClass('default')
		_.each(this.prefixClasses, function (ele, index) {
			return index == determiner ? $(div).addClass(ele) : null
		})
		$('.searchTerms').prepend(div)
		$('.searchBtn').val('')
		return callback(div)
	}

	var createTweetSVG = function(element) {
		var that = this
		var svg = helper.createNSElement('svg', {'position' : 'absolute', 'height' : 550, 'width' : 450, 'left' : '50px', 'top' : '20px'})
		var defs = helper.createNSElement('defs', {})
		var clipPath = helper.createNSElement('clipPath', {'id' : 'tweetSVG'})
		var path = helper.createNSElement('path', {'d' : 'M0,50 Q15,30 30,30 L130,30 A15,15 0 0,1 160,30 L190,30 A15,15 0 0,1 220,30 L250,30 A15,15 0 0,1 280,30 L380,30 Q395,30 410,50 L410,500 Q395,520 380,520 L280,520 A15,15 0 1,1 250,520, L220,520 A15,15 0 1,1 190,520 L160,520 A15,15 0 1,1 130,520 L30,520 Q15,520 0,490 Z'})
		var gradient = helper.createNSElement('linearGradient', {'id' : 'blueGradient'})
		var stopOne = helper.createNSElement('stop', {'offset' : .35, 'stop-color' : '#AEF'})
		var stopTwo = helper.createNSElement('stop', {'offset' : 1, 'stop-color' : '#15F'})
		var rectangle = helper.createNSElement('rect', {'clipPath' : 'url(#tweetSVG)', 'fill' : 'url(#blueGradient)', 'width' : '450', 'height' : '700'})
		var circleOne = helper.createNSElement('circle', {'r' : '15', 'cx' : '145', 'cy' : '30', 'fillOpacity' : '0', 'id' : 'circleOne'})
		var circleTwo = helper.createNSElement('circle', {'r' : '15', 'cx' : '205', 'cy' : '30', 'fillOpacity' : '0', 'id' : 'circleTwo'})
		var circleThree = helper.createNSElement('circle', {'r' : '15', 'cx' : '265', 'cy' : '30', 'fillOpacity' : '0', 'id' : 'circleThree'})
		var circleFour = helper.createNSElement('circle', {'r' : '15', 'cx' : '145', 'cy' : '520', 'fillOpacity' : '0', 'id' : 'circleFour'})
		var circleFive = helper.createNSElement('circle', {'r' : '15', 'cx' : '205', 'cy' : '520', 'fillOpacity' : '0', 'id' : 'circleFive'})
		var circleSix = helper.createNSElement('circle', {'r' : '15', 'cx' : '265', 'cy' : '520', 'fillOpacity' : '0', 'id' : 'circleSix'})
		var exitSVG = helper.createNSElement('svg', {'x' : '380', 'y' : '40', 'height' : '20', 'width' : '20', 'zIndex' : '10'})

		circleOne.addEventListener('mouseenter', function () {
			helper.setProperties.call(this, {'cursor' : 'pointer', 'fill' : '#009', 'fillOpacity' : '1'})
			helper.setProperties.call(circleFour, {'fill' : '#009', 'fillOpacity' : '1'})
		})
		circleOne.addEventListener('mouseleave', function () {
			helper.setProperties.call(this, {'cursor' : 'pointer', 'fill' : '#009', 'fillOpacity' : '0'})
			helper.setProperties.call(circleFour, {'fill' : '#009', 'fillOpacity' : '0'})
		})
		circleOne.addEventListener('click', function (ev) {
			_.each(that.tweetFormSelectors, function (ele) {
				$(ele).css('display', 'none')
			})
			// helper.setIdenticalProperties.call(that, that.tweetFormSelectors, {'display' : 'none'})
			$(that.twitterForm).css('display', 'initial')
			createTweetPreview.call(that)
		})
		circleTwo.addEventListener('mouseenter', function () {
			helper.setProperties.call(this, {'cursor' : 'pointer', 'fill' : '#009', 'fillOpacity' : '1'})
			helper.setProperties.call(circleFive, {'fill' : '#009', 'fillOpacity' : '1'})
		})
		circleTwo.addEventListener('mouseleave', function () {
			helper.setProperties.call(this, {'cursor' : 'pointer', 'fill' : '#009', 'fillOpacity' : '0'})
			helper.setProperties.call(circleFive, {'fill' : '#009', 'fillOpacity' : '0'})
		})
		circleTwo.addEventListener('click', function (ev) {
			_.each(that.tweetFormSelectors, function (ele) {
				$(ele).css('display', 'none')
			})
			$(that.imageArea).css('display', 'initial')
			createTweetPreview.call(that)
		})
		circleThree.addEventListener('mouseenter', function () {
			helper.setProperties.call(this, {'cursor' : 'pointer', 'fill' : '#009', 'fillOpacity' : '1'})
			helper.setProperties.call(circleSix, {'fill' : '#009', 'fillOpacity' : '1'})
		})
		circleThree.addEventListener('mouseleave', function () {
			helper.setProperties.call(this, {'cursor' : 'pointer', 'fill' : '#009', 'fillOpacity' : '0'})
			helper.setProperties.call(circleSix, {'fill' : '#009', 'fillOpacity' : '0'})
		})
		circleThree.addEventListener('click', function (ev) {
			_.each(that.tweetFormSelectors, function (ele) {
				$(ele).css('display', 'none')
			})
			$(that.tweetPreview).css('display', 'initial')
			createTweetPreview.call(that)
		})
		exitSVG.addEventListener('click', function (ev) {
			$(that.twitterForm).css('display', 'none')
			_.each(that.tweetFormSelectors, function (ele) {
				$(ele).css('display', 'none')
			})
			return applyEffect.call(that, that.tweetSelectors, null, 1, that, function () {
			})
		})

		helper.appendElements(gradient, [stopOne, stopTwo])
		helper.appendElements(clipPath, [path])
		helper.appendElements(defs, [gradient, clipPath])
		helper.appendElements(svg, [defs, rectangle, circleOne, circleTwo, circleThree, circleFour, circleFive, circleSix])
		helper.appendElements(element, [svg])
		var exitIcon = createIcon(svg, exitSVG, svg)
	}

	var displayImage = function(dimensions, src, ele) {
		var width = dimensions.width
		var height = dimensions.height
		var zoom = 400 / width
		if (width / height > 2) {
			$(this.formError).html(this.imageError)
			return
		}
		$(this.imagePreview).attr('src', src)
		$(this.imagePreview).css('height', height * zoom)
		recursiveZoom.call(this, this.imagePreview, 360)
		return alignImage.call(this, this.imagePreview, false)
	}

	var fetchData = function(key, callback, altCb, partial) {
		var that = this;
		var user = key || $('.gameboard').attr('id').toLowerCase();
		var item = sessionStorage.getItem(user)
		if (item) {
			return callback.call(this, JSON.parse(item), key, partial)
		}
		if (key && !item) {
			return altCb.call(this, partial)
		}
		$.ajax({
			url : '/home/' + user + '/tweetData',
			dataType : 'json',
			success : function(data) {
				// console.log(JSON.stringify(data))
				sessionStorage.setItem(user, JSON.stringify(data))
				return callback.call(that, data, key, partial)
			}
		})
	}

	var getSearchTerms = function() {
		var that = this;
		var objects = _.map($('.searchTerms').children(), function (ele) {
			var lastClass = $(ele).attr('class').split(' ').slice(-1)[0]
			return _.reduce(that.searchClasses, function (memo, value, key) {
				var searchValue = $(ele).children().eq(0).html()
				return key == lastClass ? helper.createObject(value, searchValue) : memo
			}, {})
		})
		return helper.mergeObjects(objects)
	}

	var grabFile = function (e, fileInput, callback) {
		var that = this;
		var reader = new FileReader;
		reader.onload = function() {
			$(that.imagePreview).remove()
			var tempImage = new Image
			$(tempImage).css({'position' : 'absolute', 'top' : -10000, 'left' : -10000}).attr('src', this.result).appendTo('body')
			var width = helper.createObject('width', parseFloat($(tempImage).css('width')))
			var height = helper.createObject('height', parseFloat($(tempImage).css('height')))
			_.extend(that, {'defaultImageValue' : this.result.split(',')[1]})
			$('.imageString').val(this.result.split(',')[1])
			var image = new Image()
			$(image).css({'width' : 400, 'position' : 'relative', 'left' : 55, 'zIndex' : 50, 'top' : 75}).attr('class', 'tempImage')
			$(that.imageArea).append($(image))
			$(tempImage).remove()
			return callback.call(that, helper.mergeObjects([width, height]), this.result)
		}
		reader.onloadend = function () {
			this.result = null
		}
		$('.imageFileName').val(fileInput.files[0].name)
		reader.readAsDataURL(fileInput.files[0])
	}

	var hashtagLinks = function(data) {
		var numbers = _.map(data.hashtags, function (ele) {
			var object = helper.createObject('hashtags', ele)
			return _.reduce(JSON.stringify(object).toLowerCase().split(''), function (memo, elem, index, array) {
				return +memo + array.join('').charCodeAt(index)
			}, '')
		})
		var links = _.map(numbers, function (ele, index) {
			return '/home/search/?hashtags=' + data.hashtags[index] + '&id=' + numbers[index]
		})

		var body = _.reduce(data.body.split(/[ ]/), function (mem, ele, index) {
			if (ele == '') {
				return mem
			} else if(_.contains(data.hashtags, ele)) {
				var string =  _.reduce(data.hashtags, function (memo, elem, ind) {
					return elem == ele ? memo + "<a id='link' href='" + links[ind] + "'>#" + data.hashtags[ind] + '<'  + '/a>' : memo
				}, '')
				return [].concat.call([], mem, string)
			} else {
				return [].concat.call([], mem, ele)
			}
		}, []).join(' ')
		return _.extend(this.tweetData, {'body' : body})
	}

	var keydownEvent = function (keystroke, submit, addSearchTerm) {
		if (keystroke == 13) {
			return _.isEmpty(this.keystrokes) ? submit.call(this) : addSearchTerm.call(this)
		}
		return
	}

	var recursiveSwitch = function (determiner, key, callback) {
		adjustRows.call(this, determiner, key)
		var newWidth = determineWidth.call(this)
		var list = _.map($('.detect'), function (ele, index, array) {
			var lastChild = $(ele).children().last()
			if (determiner) {
				if (index == 0 && $(ele).children().length < newWidth) {
					$(ele).append($('.detect').eq(index+1).children().first())
					return false
				} else if (index != array.length - 1 && index != 0 && $(ele).children().length < newWidth) {
					$(ele).append($('.detect').eq(index+1).children().first())
					return false
				}
				else {
					return true
				}
			} else if ( index < array.length - 1) {
				if ($(ele).children().length > newWidth) {
					switchElement(index, lastChild)
					return false
				}
				return true
			}
			return true
		})

		if (!_.every(list)) {
			return recursiveSwitch.call(this, determiner, key, callback)
		}
		this.currentElements = newWidth
		return callback.call(this)
	}

	var recursiveZoom = function(ele, value) {
		var zoom = $(ele).css('zoom')
		if ($(ele).height() * zoom > value) {
			$(ele).css('zoom', zoom -.01)
			return recursiveZoom.call(this, ele, value)
		}
		return
	}

	var search = function () {
		var that = this;
		var searchData = getSearchTerms.call(this)
		var hashtags = _.reduce(searchData, function (memo, value, key) {
			return key == 'hashtags' ? [].concat.call([], memo, value.toLowerCase()) : memo
		}, []).join('')
		var users = _.reduce(searchData, function (memo, value, key) {
			return key == 'user' ? [].concat.call([], memo, value.toLowerCase()) : memo
		}, []).join('')
		var number = _.reduce(JSON.stringify(searchData).toLowerCase().split(''), function (memo, ele, index) {
			return +memo + JSON.stringify(searchData).toLowerCase().charCodeAt(index)
		}, '')
		return $.ajax({
			url : '/home/' + $('.gameboard').attr('id').toLowerCase() + '/search/',
			data : 'hashtags=' + hashtags + '&user=' + users + '&id=' + number,
			type : 'get',
			success : function(data) {
				sessionStorage.setItem(number, JSON.stringify(data))
				var populateFields = _.each(searchData, function (value, key) {
					var newKey = value.split(',')
					return newKey.length > 1 ? _.each(newKey, function (ele) {
						$('.submitting').append(helper.createElement('input', {'name' : key, 'value' : ele}))
					}) :
					$('.submitting').append(helper.createElement('input', {'name' : key, 'value' : value}))
				})
				$('.submitting').append(helper.createElement('input', {'name' : 'id', 'value' : number})).submit()
			}
		})
	}

	var resubmitForm = function(partial) {
		var id = this.uniqueIDField
		var that = this
		var hashtags = $('.hashtags').attr('id') == void 0 ? '' : $('.hashtags').attr('id')
		var user = $('.user').attr('id')  == void 0 ? '' : $('.user').attr('id')
		var username = $('.gameboard').attr('id')
		return $.ajax({
			type : 'get',
			url : '/home/' + username + '/search/',
			data : 'hashtags=' + hashtags + '&user=' + user + '&id=' + id,
			success : function(data) {
				sessionStorage.setItem(id, JSON.stringify(data))
				return buildTable.call(that, data, null, partial)
			}
		})
	}

	var submitTweet = function () {
		var title = $(this.tweetMessageTitle).val()
		var body = $(this.tweetBody).val()
		if (_.isEmpty(title)) {
			$(this.formError).html(this.titleError)
			$(this.tweetError).html(this.tweetErrorMessage)
			return
		} else if (_.isEmpty(body)) {
			$(this.formError).html(this.bodyError)
			$(this.tweetError).html(this.tweetErrorMessage)
			return
		}

		$(this.twitterForm).submit()
		return animateTweet.call(this, this.tweetAnimationDuration)
		// return $(this.twitterForm).submit()
	}

	return {
		applyEffect : applyEffect,
		addKeys : addKeys,
		adjustOffset : adjustOffset,
		buildTable : buildTable,
		createSearchTerm : createSearchTerm,
		createSearchIcon : createSearchIcon,
		createSearchDivider : createSearchDivider,
		createTweetSVG : createTweetSVG,
		createIcon : createIcon,
		construct : construct,
		displayImage : displayImage,
		fetchData : fetchData,
		grabFile : grabFile,
		keydownEvent, keydownEvent,
		recursiveSwitch : recursiveSwitch,
		resubmitForm : resubmitForm,
		search : search,
		submitTweet : submitTweet
	}
})