define(['jquery', 'helpers'], function($, helper) {

	//private functions

	var adjustRows = function(determiner, data) {
		var data = data || JSON.parse(sessionStorage.getItem('user'))
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
			// console.log(width < array[index+1]['width'])
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

	var adjustOffset = function () {
		var fakeHeight = _.map($('.detect'), function (ele) {
			return _.map(_.range($(ele).children().length), function (elem) {
				return $(ele).children().eq(elem).children().eq(1).height()
			})
		})
		var flattendHeights = helper.flatten(fakeHeight)
		var uniqueHeights = _.uniq(flattendHeights)
		if (uniqueHeights.length == 1) {
			return setTimeout(adjustOffset, 100)
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

	var buildTable = function(data, cb) {
		var data = data || JSON.parse(sessionStorage.getItem('user'))
		var HTML = '';
		var that = this;
		var width = +$(window).width();
		var length = determineWidth.call(this);
		this.currentElements = length
		var string = _.each(_.range(Math.ceil(data.user.tweets.length / length)), function (ele, index, array){
			HTML += '<div class="row detect">'
			var newLength = (1 + index) * length > length ? data.user.tweets.length : ((1 + index) * length);
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

	var construct = function(object) {
		this.intervals = ''
		this.widthIdentifier = [{'width' : 866, 'elements' : 4}, {'width' : 1086, 'elements' : 5}, {'width' : 1306, 'elements' : 6}]
		this.currentElements = []
		object.call(this)
	};

	var fetchData = function(callback, partial) {
		var that = this;
		var item = sessionStorage.getItem('user')
		if (item)
			return callback.call(this, JSON.parse(item), partial)
		var user = $('.gameboard').attr('id').toLowerCase()
		$.ajax({
			url : '/home/' + user + '/tweetData',
			dataType : 'json',
			success : function(data) {
				sessionStorage.setItem('user', JSON.stringify(data))
				return callback.call(that, data, partial)
			}
		})
	}

	var recursiveSwitch = function (determiner, callback) {
		adjustRows.call(this, determiner)
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
			return recursiveSwitch.call(this, determiner, callback)
		}
		this.currentElements = newWidth
		return callback.call(this)
	}

	return {
		adjustOffset : adjustOffset,
		buildTable : buildTable,
		construct : construct,
		fetchData : fetchData,
		recursiveSwitch : recursiveSwitch
	}
})