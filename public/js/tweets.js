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
		console.log(user)
		var data = data || JSON.parse(sessionStorage.getItem(user))
		console.log(data)
		var rows = $('.detect').length
		var width = this.currentElements
		if(determiner) {
			return _.each($('.detect'), function (ele) {
				return $(ele).children().length == '0' ? $(ele).remove() : 'done adjusting'
			})
		}
		return Math.ceil(data.user.tweets.length / width) >= rows ? $('.container').append('<div class="row detect"></div>') : 'done adjusting'
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

	// public functions

	var addKeys = function(value) {
		return _.extend(this, {'keystrokes' : value})
	}

	var adjustOffset = function () {
		var fakeHeight = _.map($('.detect'), function (ele) {
			return _.map(_.range($(ele).children().length), function (elem) {
				console.log($(ele).children().eq(elem).children().eq(1).height())
				return $(ele).children().eq(elem).children().eq(1).height()
			})
		})
		var flattendHeights = helper.flatten(fakeHeight)
		if (_.contains(flattendHeights, 18)) {
			return setTimeout(adjustOffset, 200)
		}
		var maxHeight = _.map($('.detect'), function (ele, index, array) {
			var heights = _.map( _.range($(ele).children().length), function (elem){
				return +$(ele).children().eq(elem).height()
			})
			var maxHeight = Math.max.apply(null, heights)
			return _.each(_.range($(ele).children().length), function (elem) {
				var height = +$(ele).children().eq(elem).height() - maxHeight
				var previousOffset = index != 0 ? parseFloat($(array[index-1]).children().eq(elem).css('top')) : 0
				$(ele).children().eq(elem).css('top', height + previousOffset + 'px')
			})
		})
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
				HTML += '<div class="row tweet">'
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
		$('.container').html(HTML)
		return cb.call(this)
	}

	var construct = function(object, idField) {
		this.intervals = ''
		this.widthIdentifier = [{'width' : 866, 'elements' : 4}, {'width' : 1086, 'elements' : 5}, {'width' : 1306, 'elements' : 6}]
		this.currentElements = []
		object.call(this, idField)
	};

	var createIcon = function(element) {
		var svg = helper.createNSElement('svg',{'position' : 'absolute', 'top' : '13px', 'right' : '3px', 'zIndex' : 20, 'height' : '13px', 'width' : '13px'})
		var lineOne = helper.createNSElement('line', {'x1' : 0, 'x2' : 10, 'y1' : 3, 'y2' : 13, 'stroke' : '#fff', 'strokeWidth' : '3px'})
		var lineTwo = helper.createNSElement('line', {'x1' : 10, 'x2' : 0, 'y1' : 3, 'y2' : 13, 'stroke' : '#fff', 'strokeWidth' : '3px'})
		svg.appendChild(lineOne)
		svg.appendChild(lineTwo)
		$(element).append(svg)
		svg.addEventListener('click', function () {
			$(this).parent().remove()
		})
		svg.addEventListener('mouseenter', function () {
			this.style.cursor = 'pointer'
		})
	}

	var createSearchIcon = function(element) {
		var that = this
		// var svg = helper.createNSElement('svg', {'position' : 'absolute', 'zIndex' : 20, 'top' : '15px', 'left' : '10px', 'id' : 'temporary'})
		// var lineOne = helper.createNSElement('line', {'x1' : 0, 'x2' : 10, 'y1' : 0, 'y2' : 10, 'stroke' : '#000', 'strokeWidth' : '3px'})
		// var circle = helper.createNSElement('circle', {'r' : 8, 'cx' : 14, 'cy' : 14, 'fill' : '#000'})
		// var lineTwo = helper.createNSElement('line', {'x1' : 18, 'x2' : 28, 'y1' : 10, 'y2' : 0, 'stroke' : '#000', 'strokeWidth' : '3px'})
		var svg = helper.createNSElement('svg', {'position' : 'absolute', 'zIndex' : 20, 'top' : '15px', 'left' : '10px', 'id' : 'temporary'})
		var lineOne = helper.createNSElement('line', {'x1' : 0, 'x2' : 10, 'y1' : 0, 'y2' : 10, 'stroke' : '#000', 'strokeWidth' : '3px'})
		var circle = helper.createNSElement('circle', {'r' : 8, 'cx' : 14, 'cy' : 14, 'fill' : '#000'})
		var lineTwo = helper.createNSElement('line', {'x1' : 18, 'x2' : 28, 'y1' : 10, 'y2' : 0, 'stroke' : '#000', 'strokeWidth' : '3px'})
		svg.setAttribute('height', '50px')
		svg.setAttribute('width', '50px')
		svg.appendChild(lineOne)
		svg.appendChild(circle)
		svg.appendChild(lineTwo)
		$(element).append(svg)
		svg.addEventListener('click', function () {
			return search.call(that)
		})
		svg.addEventListener('mouseenter', function () {
			this.style.cursor = 'pointer'
		})
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

	var fetchData = function(key, callback, altCb, partial) {
		console.log(arguments)
		var that = this;
		var user = key || $('.gameboard').attr('id').toLowerCase();
		console.log('user is ' + user)
		var item = sessionStorage.getItem(user)
		if (item) {
			console.log('item found')
			return callback.call(this, JSON.parse(item), key, partial)
		}
		if (key && !item) {
			return altCb.call(this, partial)
		}
		$.ajax({
			url : '/home/' + user + '/tweetData',
			dataType : 'json',
			success : function(data) {
				console.log(JSON.stringify(data))
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

	return {
		addKeys : addKeys,
		adjustOffset : adjustOffset,
		buildTable : buildTable,
		createSearchTerm : createSearchTerm,
		createSearchIcon : createSearchIcon,
		createSearchDivider : createSearchDivider,
		createIcon : createIcon,
		construct : construct,
		fetchData : fetchData,
		keydownEvent, keydownEvent,
		recursiveSwitch : recursiveSwitch,
		resubmitForm : resubmitForm,
		search : search
	}
})