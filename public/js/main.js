function Spider() {
	var initial = {'cards' : ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], 'intervals' : [], 'list' : [], 'data' : [], 'draglist' : [], 'identity' : [],
			'droppables' : [], 'fullOffsetList' : [], 'movelist' : [], 'keys' : [], 'hoverMatches' : [], 'clickedMatches' : [], 'hoveredData' : [], 'draggedData' : [],
			'draggedEleString' : [], 'shuffledDeck' : [], 'ImageDimensions' : {'height' : 96, 'width' : 71}, 'allowEvent' : '', 'oldHoverCard' : []};

	var o = {'game' : initial}
	
	var that = this

	o.addMove = function(row) {
		var movelist = helper.existy(row) ? [].concat.call(this.game.movelist, {'row' : true, 'rowCards' : row, 'matchedDragged' : this.game.clickedMatches, 'matchedHovered' : this.game.hoverMatches,
													 'hoveredData' : this.game.hoveredData, 'draggedData' : this.game.draggedEleString})
									 : [].concat.call(this.game.movelist, {'oldHoverCard' : this.game.oldHoverCard, 'hoverString' : this.game.hoverString, 'hoverElements' : this.game.hoverElements,
													 'draggedElements' : this.game.draggedElements, 'draggedEleString' : this.game.draggedEleString, 'draggedEleOffsets' : this.game.draggedEleOffsets})	
		return _.extend(this.game, {'movelist' : movelist})
	}

	o.buildDragList = function(list) {
		var offset = this.game.initialOffset
		var items = _.reduce(list, function (memo, element) {
			return (element['top'] >= offset['top']) ? [].concat.call([], memo, element) : memo
		}, [])
		return items.sort(function (a, b){
			return a.top - b.top
		}) 
	}

	o.buildList = function(list) {
		return _.map(list, function (ele) {
			return _.has(ele, 'id') ? $(ele).attr('id') : helper.getFirstKey(ele)
		})
	}

	o.buildValueList = function(value, ele) {
		var suits = _.uniq(this.game.suits)
		var val =  _.map(suits, function (ele) {
			return value == null ? value : [value, ele].join('')
		})
		return helper.existy(_.first(val)) ? _.extend(this.game, {'droppables' : val, 'initialOffset' : $(ele).offset()}) : [null]
	}

	o.buildValues = function(hoverData) { // hoverdata is a list of objects, list is a list of dom elements
		var list = this.game.draglist
		var baseValue = _.values(_.first(hoverData))
		console.log(baseValue)
		var hoverElements = this.sortIds(this.buildList(hoverData))
		var otherElements = this.sortIds(this.buildList(list))
		otherElements = (_.some(otherElements, _.isArray) ? helper.flatten(otherElements) : otherElements)
		var fullList = [].concat.apply([], [hoverElements, otherElements])
		var draggedOffsets = _.map(otherElements, function (ele, index) {
			return _.isEmpty(that.game.initialOffset) ? {} : {'left' : that.game.initialOffset['left'], 'top' : (+that.game.initialOffset['top'] + (index * 20))}
		})
		var otherBaseValue = _.reduce(this.game.data, function (memo, ele) {
			return $(_.first(list)).attr('id') == helper.getFirstKey(ele) ? [].concat.call([], memo, ele) : memo
		}, [])
		var uniqueString = _.uniq((baseValue + ' ' + _.values(_.first(otherBaseValue))).split(' ')).join(' ')
		return _.extend(this.game, {'elementlist' : fullList, 'draggedEleString' : _.values(_.first(otherBaseValue)), 'fullBaseValue' : uniqueString,
		'hoverElements' : hoverElements, 'draggedElements' : otherElements, 'hoverString' : baseValue, 'draggedEleOffsets' : draggedOffsets})
	}

	o.calculateLeft = function(element) {
		var offset = (element ? element : this.game.initialOffset)
		var reduced = _.reduce(this.game.fullOffsetList, function (memo, elem) {
			return elem['left'] == offset['left'] ? [].concat.call([], memo, elem) : memo
		}, [])
		return reduced.sort(function (a,b) {
			return a['top'] - b['top']
		})
	}

	o.calculateOffset = function(obj) {
		var list = _.map($('#deck>img'), function(ele) {
			return $(ele).offset()
		})
		var left = _.map(list, function(ele) {
			return ele['left']
		})
		var duplicateFree = _.uniq(left)
		var ArrayofArray = _.map(duplicateFree, function (ele) {
			return _.reduce(list, function (memo, element) {
				return element['left'] == ele ? [].concat.call([], memo, element) : memo
			}, [])
		})
		var sorted = _.map(ArrayofArray, function (ele) {
			return _.first(ele.sort(function (a, b) {
				return b['top'] - a['top']
			}))
		})
		return _.extend(this.game, {'offsets' : sorted})
	}

	o.captureInnerHTML = function(selector) {
		return _.map($(selector), function (ele) {
			return $(ele).prop('outerHTML')
		}).join(' ')
	}

	o.clearIntervals = function(deferred, successcb, failcb) {
		_.map(this.game.intervals, function(ele) {
					window.clearInterval(ele)})	
		_.extend(this.game, {'intervals' : []})
		if (!helper.existy(failcb)) {
			deferred.resolve()
			return deferred.promise().done(successcb)
		}
	}

	o.createDeck = function(suits) {
		_.extend(this.game, {'suits' : suits})
		var cardList = this.game.cards;		
		var list = _.map(this.game.suits, function (ele, ind, arr) {
			return _.map(cardList, function (elem) {
				return [elem, ele].join('')
			})
		})
		var deck = helper.flatten(list)
		_.extend(this.game, {'shuffledDeck' : deck})
	}

	o.deckCard = function(position, deferred, alwayscb) {
		var card = document.elementFromPoint(this.game.initialOffset['left'], this.game.initialOffset['top'])
		var length = $("#deck>img[id*='card']")  
		helper.extractString($(card).attr('id')) != 'deckCard' ? deferred.reject().fail(alwayscb) : $(card).fadeOut({ duration : 250, complete: function() {
			var deck = _.reduce(that.game.shuffledDeck, function (memo, ele, ind) {
				return ind == position ? [].concat.call([], memo, ele) : memo
			}, []).join('')
			var offset = {'left' : +that.game.initialOffset['left'], 'top' : (+that.game.initialOffset['top'] - 20)}
			var src = '/Img/spider/dealer.gif'
			var id = 'deckCard' + (+position + 1)
			_.extend(that.game, { 'oldHoverCard' : {'index' : position, 'zindex' : $(card).zIndex(), 'offset' : offset, 'deckcard' : true, 'src' : src, 'id' : id, 'data' : deck}})
			$('#deck>img').eq(position).before(html.buildHTML('img', [{'z-index' : $(card).zIndex()}, {'left' : offset['left']}, {'top' : offset['top']}], [{'class' : deck}, {'src' : '/Img/spider/' + deck + '.gif'}, {'id' : ('card' + (length.length + 1))}]))
		}})
		$(card).promise().done(function() {
			helper.extractString($(card).attr('id')) == 'card' ? null : $(card).remove()
			deferred.resolve(position).done(alwayscb)
		})
	}

	o.dealDeck = function(card, placeholder, list, deferred, callback) {
		var offset;
		if(_.isEmpty(this.game.list)) 
			_.extend(this.game, {'list' : list})
		$('#' + placeholder + _.first(this.game.list)).length == 0 ? 
		(offset = this.determination('#bottomDeck>img', 0)) : 
		(offset = $('#' + placeholder + _.first(this.game.list)).offset())
		$('#' + card + _.first(this.game.list)).animate({
			left : offset['left'],
			top : offset['top']
		})

		_.extend(this.game, {'list' : _.rest(this.game.list)})
		if(_.isEmpty(this.game.list))
			this.clearIntervals(deferred, callback)
	}

	o.dealRow = function(list, deferred, callback) {
		if (_.isEmpty(this.game.list)) 
			_.extend(this.game, {'list' : list})	
		$('#bottomDeck>img').eq(_.first(this.game.list)).animate({
			top : 20 + (+that.game.offsets[_.first(that.game.list)]['top']),
			left : that.game.offsets[_.first(that.game.list)]['left']
		})
		_.extend(this.game, {'list' : _.rest(this.game.list)})
		if (_.isEmpty(this.game.list))
			return clearIntervals(deferred, callback)
	}

	o.determination = function(special, index) {
		return $(special).eq(index).offset()
	}

	o.determineHoverElement = function(ele) {
		var ele = this.switchARoo(ele),
			left = ele['left'],
			top = ele['top'],
			d = this.game.ImageDimensions,
			list = _.reduce(this.game.offsets, function (memo, e) {
			return (e['left'] + d['width'] - 41 > left) && (e['left'] - 26 < left) && 
			(Math.abs(top - e['top']) >= 0) && (Math.abs(top - e['top'] <= 70)) && !_.isEqual(that.game.initialOffset, e) ?
			[].concat.call([], memo, e) : memo
		}, [])
		return _.isEmpty(list) ? [] : _.first(list)
	}

	o.determinePosition = function() {
		var item = this.switchARoo(this.game.initialOffset),
			id = $(item).attr('id')
		return _.reduce(this.game.identity, function (memo, ele, index) {
			return _.has(ele, id) ? [].concat.call([], memo, index) : memo
		}, []).join('')
	}

	o.defaulted = function(value) {
		var props = _.rest(arguments, 1)
		return helper.defaultValues.call(this, this.game, value, props)
	}

	o.difficulty = function(level) {
		switch (level) {
			case 'easy' :
			return _.map(_.range(1, 9), function (ele) {
				return 's'
			})
			break
			case 'medium' :
			return _.map(_.range(1, 9), function (ele) {
				return ele % 2 == 0 ? 's' : 'h'
			})
			break
		}
	}

	o.dragging = function(failcb, successcb) {
		var ele = this.game.clicked
			list = this.game.draglist

		$(ele).draggable({
			drag : function(e, ui) {
				_.each(list, function (ele, ind) {
					$(ele).zIndex(100 + ind)
					$(ele).css({
						left : ui.offset.left,
						top : (ui.offset.top + (ind * 20))
					})
				})
			}, 

			revert: function() {
				var hoverElement = that.game.hovered
				var list = _.map(that.game.droppables, function (ele) {
					return ele == that.extractIdentity(hoverElement) ? 'true' : 'false'
				})
				return _.every(list, function (ele) {
					return ele == 'true'
				}) ? (successcb.call(that, that.game), false) : (failcb.call(that, that.game), true)			
			}
		})	
	}

	o.edgeCase = function(value) {
		switch (value) {
			case 'A' :
			return '2'
			break
			case '10' :
			return 'J'
			break
			case 'J' :
			return 'Q'
			break
			case 'Q' :
			return 'K' 
			break
			case 'K' :
			return null
		}
	}

	o.extractIdentity = function(ele) {
		var id = $(ele).attr('id')
		return _.reduce(this.game.identity, function (memo, ele) {
			return _.has(ele, id) ? helper.getFirstValue(ele) : memo
		})
	}

	o.extractCard = function(identity) {
		var card = identity.split('')
		return identity.length > 2 ? _.first(card, 2).join('') : _.first(card)
	}

	o.fadeOut = function(list, deferred, duration, selector, secondSelector, successcb, failcb) {
		if (_.isEmpty(this.game.list))
			_.extend(this.game, {'list' : list})
		$(selector).eq(_.first(this.game.list)).fadeOut({duration : duration, complete : function() {
			var z = $(switchARoo(that.game.offsets)[$(this).index()]).zIndex()
			var index = $(this).index()
			var length = $('#deck>img').length
			var id = $("#deck>img[id*='card']").length
			if (existy(secondSelector)) {
				// html.buildHTML('img', [{'z-index' : (+z+1)}, {'left' : that.game.offsets[index]['left']}, {'top' : +that.game.offsets[index]['top'] + 20}], [{'class' : that.game.shuffledDeck[length]}, {'src' : '/Img/spider/' + obj.shuffledDeck[length] + '.gif'}, {'id' : ('card' + (id + 1) )}])
				$(secondSelector).append(html.buildHTML('img', [{'z-index' : (+z+1)}, {'left' : that.game.offsets[index]['left']}, {'top' : +that.game.offsets[index]['top'] + 20}], [{'class' : that.game.shuffledDeck[length]}, {'src' : '/Img/spider/' + obj.shuffledDeck[length] + '.gif'}, {'id' : ('card' + (id + 1) )}]))
			}
			if (index == _.last(list)) {
				deferred.reject()
				deferred.promise().fail(failcb)
			} 
		}})
		_.extend(this.game, {'list' : _.rest(this.game.list)})
		if (_.isEmpty(this.game.list)) 
			return clearIntervals(deferred, successcb, failcb)
	}

	o.fixBaseString = function() {
		var list = this.game.draglist
		var baseLength = _.first(this.game.draggedEleString).split(' ').length
		// console.log(obj.draggedEleString)
		// console.log('baseLength is ' + baseLength)
		var tempValue = _.last(_.first(this.game.draggedEleString).split(' '), this.game.draglist.length)
		// console.log('tempValue is ' + tempValue)
		var baseValue = (_.isArray(tempValue) ? tempValue.join(' ') : tempValue)
		// console.log('baseValue is ' + baseValue)
		var keys = this.buildList(list)
		// console.log('keys are ' + keys)
		_.extend(this.game.oldHoverCard, {'oldHoverString' : this.game.draggedEleString})
		return _.each(this.game.data, function (ele, index) {
			return helper.anyKey(keys, ele) ? (that.game.data[index] = helper.createObject(helper.whichKey(keys, ele), baseValue)) : ele
		})
	}

	o.fixCss = function() {
		var draglist = this.game.draglist
		var acceptedDraggable = $(this.game.hovered).offset()
		_.each(draglist, function (ele, ind) {
			$(ele).css({
				left : acceptedDraggable['left'],
				top : +acceptedDraggable['top'] + (20 * (ind + 1) )
			})
		})
		return draglist
	}

	o.fixZIndex = function(list) {
		var base = $(this.game.hovered).zIndex()
		return _.map(list, function (ele, ind) {
			return $(ele).zIndex(base + ind + 1)
		})
	}

	o.fixOldData = function(list) {
		var baseLength = helper.stringLength(this.game.draggedEleString)
		console.log('baseLength is ' + baseLength)
		var tempValue = _.first(_.first(this.game.draggedEleString).split(' '), (baseLength - this.game.draglist.length))
		console.log('tempValue is ' + tempValue)
		var baseValue = (_.isArray(tempValue) ? tempValue.join(' ') : tempValue)
		console.log('baseValue is ' + baseValue)
		console.log(JSON.stringify(list))
		var keyList = _.map(list, helper.getFirstKey)
		var keys = this.sortIds(keyList) //keyList function has been put in helpers module under a predicate function allKeys
		// console.log('keys are ' + keys)
		var elements = helper.createObject('oldHoverElements', keys)
		_.extend(this.game, {'oldHoverCard' : elements})
		return _.each(this.game.data, function (ele, index) {
			return helper.anyKey(keys, ele) ? (that.game.data[index] = helper.createObject(helper.whichKey(keys, ele), baseValue)) : ele
		})
	}

	o.fullOffsetList = function() {
		var keys = _.map(this.game.identity, helper.getFirstKey)
		var list = _.map(keys, function (ele) {
			return $('#' + ele).offset()
		})
		return _.extend(this.game, {'fullOffsetList' : list})
	}

	o.generateBoard = function(rows, columns) {
		return html.generateBoard(this, rows, columns)
	}

	o.initialCondition = function(element, newgame, loadgame) {
		return $(element).attr('id') == 'new-game' ? ($('#initial>button').css('display', 'none'), $('#difficulty>button').css('display', 'inline'), $('#cheating>button').css('display', 'none')) : 
		$(element).attr('id') == 'load-game' ? ($('#initial>button').css('display', 'inline'),  $('#difficulty>button').css('display', 'none'), $('#cheating>button').css('display', 'inline'), loadgame()) : 
		($('#initial>button').css('display', 'inline'),  $('#difficulty>button').css('display', 'none'), $('#cheating>button').css('display', 'inline'), newgame($(element).attr('id')))
	}

	o.intervals = function(func, speed, deferred, successcb, failcb) {
		var intervals = this.game.intervals
		return _.extend(this.game, {'intervals' : intervals.concat.apply([],[intervals, window.setInterval(func, speed, deferred, successcb, failcb)] )})
	}

	o.loadGame = function(cb) {
		var id = $('.gameboard').attr('id')
		return $.ajax({
			dataType : 'json',
			type : 'post',
			url : '/loadgame/' + id,
			success : function(data) {
				cb(data)
			},
			error: function(error) {
				console.log(error)
			}
		})
	}

	o.mergeObjects = function(objects) {
		var obj = {}
		_.each(objects, function (ele, index) {
			var value = helper.getFirstValue(ele)
			for (prop in ele) {
				if (ele.hasOwnProperty(prop))
					obj[prop] = value
			}
		})
		return obj
	}


	o.objectList = function(list) { // expects a list of offsets
		if (!_.isArray(list)) 
			list = _.toArray(arguments)
		var idList = _.map(list, function (ele) {
			return $(that.switchARoo(ele)).attr('id')
		}) // gets a list of ids
		console.log(idList)
		var dataList = _.reduce(this.game.data, function (memo, ele) {
			return memo.concat(_.pick(ele, _.values(idList)))
		}, []) // returns an array of objects that matches the array of ids
		var objectList = _.reduce(dataList, function (memo, ele) {
			return _.isEmpty(ele) ? memo : [].concat.call([], memo, ele)
		}, []) // filters out empty objects
		console.log(objectList)
		var hoverElements = _.reduce(objectList, function (memo, ele, ind, arr) {
			return _.isEqual(_.values(ele), _.values(_.last(arr))) ? [].concat.call([], memo, ele) : memo
		}, []) // returns an array of data objects that match the hover element
		console.log(hoverElements)
		return _.last( hoverElements, _.values(_.last(hoverElements)).join('').split(' ').length) // returns the last n elements based on the length of the length of the data value
	}

	o.offsetCheck = function(callback) {
		return helper.arrayCheck(this.game.fullOffsetList, this.setData, null, 'identity', callback)
	}

	o.populateBoard = function(obj) {
		$('#deck').html(obj.game.deckHTML)
		$('#bottomDeck').html(obj.game.cardStackHTML)
		for (prop in obj.game) {
			if (obj.game.hasOwnProperty(prop)) 
				that.game[prop] = obj.game[prop]
		}
		return this.game
	}

	o.revertEvent = function(prop, ele, deferred, cb) {
		var base = $(ele).offset()
		var list = this.game[prop]
		var offset = (_.isEmpty(this.game.initialOffset) ? _.last(_.first(this.game.movelist.draggedEleOffsets)) : this.game.initialOffset)
		_.map(list, function (element, ind) {
			$(element).css({
				left : base['left'],
				top : +base['top'] + (ind * 20)
			})
		})
		return _.isEqual($(ele).offset(), offset) && helper.existy(deferred) ? this.clearIntervals(deferred, cb) : this
	}

	o.revertZIndex = function(prop) {
		var list = this.game[prop]
		var base = $(document.elementFromPoint(this.game.initialOffset['left'], (+this.game.initialOffset['top'] - 20) )).zIndex()
		return _.map(list, function (ele, ind){
			return $(ele).zIndex(base + ind)
		})
	}

	o.recursiveGrouping = function(offsets, list) {
		if (_.isEmpty(offsets))
			return list
		else {
			var off = _.first(offsets)
			var item = $(this.switchARoo(off)).attr('id')
			var data = _.reduce(this.game.data, function (memo, ele) {
				return helper.getFirstKey(ele) == item ? [].concat.call([], memo, ele) : memo
			}, [])
			var datalength = helper.stringLength(_.values(_.first(data)))
			var elements = _.first(offsets, datalength)
			var remainingElements = (offsets.length - datalength == 0 ? [] : _.last(offsets, (offsets.length - data.length)))
			return this.recursiveGrouping(remainingElements, [].concat.call([], list, [elements]))
		}
	}

	o.saveHTML = function() {
		var deck = this.captureInnerHTML($('#deck>img'))
		var cardStack = this.captureInnerHTML($('#bottomDeck>img'))
		return _.extend(this.game, {'deckHTML' : deck, 'cardStackHTML' : cardStack})
	}

	o.separatedList = function(compareTo) {
		var args = _.toArray(arguments)
		if (args.length == 1) 
			return true
		return that.recursiveGrouping(compareTo, [])
	}

	o.setData = function(identity, cb) {
		_.extend(this.game, {'identity' : []})
		var deck = this.totalDeck()
		var arr = _.map(deck, function(ele, ind) {
			var object = helper.createObject($(ele).attr('id'), that.game.shuffledDeck[ind])
			return identity ? that.updateIdentity(object) : 
			_.extend(that.game, {'data' : [].concat.call([], that.game.data, object)}) 
		})
		return cb ? cb(this.game.data) : arr
	}

	o.setElements = function(hovered, clicked) {
		var element,
			offset = $(clicked).offset(),
			clicked = document.elementFromPoint(offset['left'], offset['top']),
			dealer = $('.dealer').offset()
		_.isEmpty(hovered) ? element = document.elementFromPoint(dealer['left'], dealer['top']) : 
							 element = document.elementFromPoint(hovered['left'], hovered['top'])
		return _.extend(this.game, {'clicked' : clicked, 'hovered' : element})
	}

	o.shuffleDeck = function() {
		var array = helper.randomizer(this.game.shuffledDeck)
		return _.extend(this.game, {'shuffledDeck' : array})
	}

	o.sortIds = function(array) { //give list of offsets
		console.log(array)
		return array.sort(function (a, b) {
			var firstOffset = $('#' + a).offset()
			var secondOffset = $('#' + b).offset()
			return firstOffset['top'] - secondOffset['top']
		})
	}

	o.switchARoo = function(item) { // returns offset if given a jquery element else it returns a DOM element
		return _.has(item, 'left') ? document.elementFromPoint(item['left'], item['top']) : $(item).offset()
		// return _.map(list, function(ele) {
		// 	return _.has(ele, 'left') ? document.elementFromPoint(ele['left'], ele['top']) : $(ele).offset()
		// })
	}

	o.totalDeck = function() {
		var deck = _.map($('#deck>img'), function (ele) {
			return $(ele)
		})
		var hiddenDeck = _.map($('#bottomDeck>img'), function (ele) {
			return $(ele)
		})
		return [].concat.call([], deck, hiddenDeck)
	}

	o.updateGame = function() {
		var id = $('.gameboard').attr('id')
		return $.ajax({
			contentType : 'application/json' ,
			type : 'post',
			url : '/update/' + id,
			data : JSON.stringify({game : that.game}),
			success : function(data) {
				console.log(data)
			}
		}).then(function() {
			console.log('done updating')
		})
	}

	o.updateIdentity = function(value) { // use to update the identities in object when a deckcard is revealed
		return _.extend(this.game, {'identity' : [].concat.call([], this.game.identity, value)})
	}

	o.updateData = function(deferred, failcb, successcb) {
		var draglist = (_.has(this.game, 'draglist') ? this.game.draglist : [this.game.clicked])
		if (_.toArray(arguments).length == 1) {
			return this.updateElementData(this.game.elementlist, this.game.fullBaseValue, this.game)
		}
		else if (_.first(this.game.draggedEleString).split(' ').length > draglist.length) {
			return deferred.reject().fail(failcb, successcb)
		} else {
			return (this.updateElementData(this.game.elementlist, this.game.fullBaseValue, this.game), deferred.resolve().done(successcb))
		}
	}

	o.updateElementData = function(list, value, obj) {
		if (_.isObject(_.first(value))) {
			value = _.map(value, convertValue)
		} else if (typeof value == 'string') {
			var array = value.split(' ')
			value = _.map(_.range(array.length), function (ele) {
				return value
			})
		} else {
			value = value
		}
		return _.map(obj.data, function (ele, index) {
			return helper.anyKey(list, ele) ? obj.data[index] = helper.createObject(helper.whichKey(list, ele), helper.whichValue(value, list, ele)) : ele
		})
	}

	o.updateDataKeys = function() {
		var data = helper.updateDataSet(this.game.identity, this.game.data)
		return _.extend(this.game, {'data' : data})
	}

	o.validDroppable = function(value) {
		return (!isNaN(value) && +value != 10) ? (+value + 1).toString() : this.edgeCase(value)
	}

	var addToProto = function(obj, baseObj) {
		for (prop in baseObj)
			obj.prototype[prop] = baseObj[prop]
	}

	addToProto(Spider,o)
}