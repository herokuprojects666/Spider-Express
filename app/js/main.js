function Spider() {
	// var initial = {'cards' : ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], 'intervals' : [], 'list' : [], 'data' : [], 'draglist' : [], 'identity' : [],
	// 		'droppables' : [], 'fullOffsetList' : [], 'movelist' : [], 'keys' : [], 'hoverMatches' : [], 'clickedMatches' : [], 'hoveredData' : [], 'draggedData' : [],
	// 		'draggedEleString' : [], 'shuffledDeck' : [], 'ImageDimensions' : {'height' : 96, 'width' : 71}, 'allowEvent' : '', 'oldHoverCard' : [], 'currentRow' : [], 'previousRow' : [], 'keys' : []};
	var initial = {'allowEvent' : '', 'cardStackHTML' : '', 'cards' : ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], 'clicked' : [], 'clickedMatches' : [], 'currentRow' : [],
				   'data' : [], 'deckHTML' : '', 'draggedData' : [], 'draggedEleOffsets' : [], 'draggedEleString' : [], 'draggedElements' : [], 'draglist' : [], 'droppables' : [], 'elementlist' : [],
				   'fullBaseValue' : [], 'fullOffsetList' : [], 'hoverElements' : [], 'hoverMatches' : [], 'hoverString' : [], 'hovered' : [], 'hoveredData' : [], 'imageDimensions' : {'height' : 96, 'width' : 71}, 
				   'identity' : [], 'initialOffset' : [],'intervals' : [], 'keys' : [], 'list' : [], 'movelist' : [], 'offsets' : [], 'oldHoverCard' : [], 'previousRow' : [], 'shuffledDeck' : [], 'suits' : [],
					'stackSelectors' : ['#stack1>img', '#stack2>img', '#stack3>img', '#stack4>img', '#stack5>img', '#stack6>img', '#stack7>img', '#stack8>img']};

	var o = {'game' : initial}
	
	var that = this

	o.addMove = function(row) {
		var object = _.isEmpty(this.game.oldHoverCard) ? {'hoverString' : this.game.hoverString, 'hoverElements' : this.game.hoverElements, 'draggedElements' : this.game.draggedElements, 'draggedEleString' : this.game.draggedEleString,
														  'draggedEleOffsets' : this.game.draggedEleOffsets} : {'oldHoverCard' : this.game.oldHoverCard, 'hoverString' : this.game.hoverString, 'hoverElements' : this.game.hoverElements,
													 	  'draggedElements' : this.game.draggedElements, 'draggedEleString' : this.game.draggedEleString, 'draggedEleOffsets' : this.game.draggedEleOffsets}

		var movelist = helper.existy(row) ? [].concat.call(this.game.movelist, {'row' : true, 'rowCards' : row, 'matchedDragged' : this.game.clickedMatches, 'matchedHovered' : this.game.hoverMatches,
													 'hoveredData' : this.game.hoveredData, 'draggedData' : this.game.draggedEleString}) : [].concat.call(this.game.movelist, object)	
		return _.extend(this.game, {'movelist' : movelist})
	}

	o.addCompletedStack = function(array) {
		var offsets = _.map(array, this.switchARoo)
		var idList = this.buildList(array)
		var offsetObj = helper.createObject('offsets', offsets)
		var idObj = helper.createObject('elements', idList)
		var finalObj = this.mergeObjects([offsetObj, idObj])
		return _.extend(_.last(this.game.movelist), {'completedStack' : finalObj})
	}

	o.buildDragList = function(list, offset) {
		// console.log(this.game.droppables)
		var offset = helper.existy(offset) ? offset : this.game.initialOffset
		var items = _.reduce(list, function (memo, element) {
			return (element['top'] >= offset['top']) ? [].concat.call([], memo, element) : memo
		}, [])
		return items.sort(function (a, b){
			return a.top - b.top
		}) 
	}

	o.buildList = function(list) {
		return _.map(list, function (ele) {
			return _.has(ele, 'id') || ele instanceof jQuery ? $(ele).attr('id') : (ele instanceof HTMLElement || (ele.nodeType && ele.nodeType == 1) ) ? ele.getAttribute('id') : helper.getFirstKey(ele)
		})
	}

	o.buildValueList = function(value, ele) {
		var suits = _.uniq(this.game.suits)
		var val =  _.map(suits, function (ele) {
			return value == null ? value : [value, ele].join('')
		})
		// console.log(val)
		return helper.existy(_.first(val)) ? _.extend(this.game, {'droppables' : [].concat.call([], val, 'any'), 'initialOffset' : $(ele).offset()}) : [null]
	}

	o.buildValues = function(hoverData, specialCase) { // hoverdata is a list of objects, list is a list of dom elements
		var list = (_.isEmpty(this.game.draglist) ? [this.game.clicked] : this.game.draglist)
		var baseValue = _.values(_.first(hoverData))
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
		var draggedEleString = helper.existy(specialCase) ? _.values(_.first(otherBaseValue)) : [].concat.call([], this.game.draggedEleString, _.values(_.first(otherBaseValue)))
		return _.extend(this.game, {'elementlist' : fullList, 'draggedEleString' : draggedEleString, 'fullBaseValue' : uniqueString,
		'hoverElements' : hoverElements, 'draggedElements' : otherElements, 'hoverString' : baseValue, 'draggedEleOffsets' : draggedOffsets})
	}

	o.calculateLeft = function(element) {
		var offset = (element ? element : this.game.initialOffset)
		var reduced = _.reduce(this.game.fullOffsetList, function (memo, elem, index) {
			return elem['left'] == offset['left'] ? [].concat.call([], memo, elem) : memo
		}, [])
		return reduced.sort(function (a,b) {
			return a['top'] - b['top']
		})
	}

	o.calculateOffset = function() {
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
		return (_.extend(this.game, {'offsets' : sorted}), sorted)
	}

	o.captureInnerHTML = function(selector) {
		return _.map($(selector), function (ele) {
			return $(ele).prop('outerHTML')
		}).join(' ')
	}

	o.cheat = function(selector, speed) {
		var index = Math.floor(Math.random() * selector.length)
		var offset = $(selector).eq(index).offset()
		$("#deck>img[id*='deck']").eq(index).fadeOut({duration : speed, complete : function() {
			var z = $(selector).eq(index).zIndex() + 1 
			var number = index + 1
			var src = '/Img/spider/'
			var card = that.game.shuffledDeck[index]
			$("#deck>img[id*='deck']").eq(index).after(html.buildHTML('img', [{'z-index' : z}, {'left' : offset['left']}, {'top' : offset['top']}, {'display' : 'none'}], 
				[{'class' : card}, {'src' : src + card + '.gif'}, {'id' : 'card' + number}]))
			$("#deck>img[id*='ard']").eq(index + 1).fadeIn({duration : speed, complete : function() {
				$(this).fadeOut({duration : speed, complete : function() {
					console.log($(this))
					$(this).remove()
					$("#deck>img[id*='deck']").eq(index).fadeIn({duration : speed})
				}})
			}})
		}})
	}

	var checkForKeys = function(requiredKeys, keylist) {
		var array = helper.anyValue(requiredKeys, keylist)
		return _.every(array)
	}

	o.checkForKeys = function(requiredKeys) {
		return checkForKeys(requiredKeys, this.game.keys)
	}

	o.completedSuit = function() {
		var finalLocation = this.stackLocation()
		console.log(finalLocation)
		var data = _.reduce(this.game.data, function (memo, ele, index) {
			var selector = _.first(that.mapSelectors([helper.getFirstKey(ele)]))
			var offset = that.switchARoo(selector)
			var completedDeck = $(finalLocation).offset()
			return helper.stringLength(helper.getFirstValue(ele)) == 13 && offset['left'] > completedDeck['left'] ? [].concat.call([], memo, helper.getFirstKey(ele)) : memo
		}, [])
		var selectors = this.mapSelectors(data)
		var offsets = _.map(selectors, this.switchARoo)
		var sorted = this.sortOffsets(offsets)
		var elements = _.map(sorted, this.switchARoo)
		return elements
	}

	o.clearIntervals = function(deferred, successcb, failcb, args) {
		_.map(this.game.intervals, function(ele) {
					window.clearInterval(ele)})	
		_.extend(this.game, {'intervals' : []})
		if (!helper.existy(failcb)) {
			deferred.resolve()
			return deferred.promise().done(successcb(args))
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

	o.currentRow = function() {
		return this.idList(this.game.currentRow)
	}

	o.curry = function(func, arg) {
		var args = _.rest(arguments, 2)
		var finalArgs = [].concat.call([], args, arg)
		return func.apply(this, finalArgs)
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
			helper.extractString($(card).attr('id')) == 'card' ||
			helper.extractString($(card).attr('id')) == 'any' ? null : $(card).remove()
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
			return this.clearIntervals(deferred, callback)
	}

	o.defaulted = function(value) {
		var props = _.rest(arguments, 1)
		return helper.defaultValues.call(this, this.game, value, props)
	}

	o.determination = function(special, index) {
		return $(special).eq(index).offset()
	}

	o.determineHoverElement = function(ele) {
		var ele = this.switchARoo(ele),
			left = ele['left'],
			top = ele['top'],
			d = this.game.imageDimensions,
			list = _.reduce(this.game.offsets, function (memo, e) {
			return (e['left'] + d['width'] - 41 > left) && (e['left'] - 26 < left) && 
			(Math.abs(top - e['top']) >= 0) && (Math.abs(top - e['top'] <= 70)) && !_.isEqual(that.game.initialOffset, e) ?
			[].concat.call([], memo, e) : memo
		}, [])
		return _.isEmpty(list) ? [] : _.first(list)
	}

	o.determineMove = function(prop, move, failcb, successcb) {
		var prop = helper.containsSubString(prop, '.') ? helper.returnSubString(prop, '.') : prop
		var successcb = helper.existy(successcb) ? successcb : (function() {})
		return _.has(move, prop) ? (failcb(move), successcb(move)) : successcb(move) 
	}

	o.determinePosition = function() {
		var item = this.switchARoo(this.game.initialOffset),
			id = $(item).attr('id')
		return _.reduce(this.game.identity, function (memo, ele, index) {
			return _.has(ele, id) ? [].concat.call([], memo, index) : memo
		}, []).join('')
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

	o.disableDragging = function(selector) {
		var array = $(selector)
		return _.each(array, function (ele) {
			$(ele).draggable()
			return $(ele).attr('id') == 'any' ? $(ele).draggable('disable') : $(ele)
		})
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
				return _.some(list, function (ele) {
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
			return 'none'
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
		return helper.containsSubString(identity, 'any') ? 'any' : identity.length > 2 ? _.first(card, 2).join('') : _.first(card)
	}

	o.fadeOut = function(list, deferred, duration, selector, secondSelector, successcb, failcb) {
		if (_.isEmpty(this.game.list))
			_.extend(this.game, {'list' : list})
		$(selector).eq(_.first(this.game.list)).fadeOut({duration : duration, complete : function() {
			var z = $(that.switchARoo(that.game.offsets[$(this).index()])).zIndex()
			var index = $(this).index()
			var length = $('#deck>img').length
			var id = $("#deck>img[id*='card']").length
			if (helper.existy(secondSelector)) {
				// html.buildHTML('img', [{'z-index' : (+z+1)}, {'left' : that.game.offsets[index]['left']}, {'top' : +that.game.offsets[index]['top'] + 20}], [{'class' : that.game.shuffledDeck[length]}, {'src' : '/Img/spider/' + obj.shuffledDeck[length] + '.gif'}, {'id' : ('card' + (id + 1) )}])
				$(secondSelector).append(html.buildHTML('img', [{'z-index' : (+z+1)}, {'left' : that.game.offsets[index]['left']}, {'top' : +that.game.offsets[index]['top'] + 20}], [{'class' : that.game.shuffledDeck[length]}, {'src' : '/Img/spider/' + that.game.shuffledDeck[length] + '.gif'}, {'id' : ('card' + (id + 1) )}]))
			}
			if (index == _.last(list)) {
				deferred.reject()
				deferred.promise().fail(failcb)
			} 
		}})
		_.extend(this.game, {'list' : _.rest(this.game.list)})
		if (_.isEmpty(this.game.list)) 
			return this.clearIntervals(deferred, successcb, failcb)
	}

	o.fixBaseString = function() {
		var list = this.game.draglist
		var baseLength = _.first(this.game.draggedEleString).split(' ').length
		// console.log(this.game.draggedEleString)
		// console.log('baseLength is ' + baseLength)
		var tempValue = _.last(_.first(this.game.draggedEleString).split(' '), this.game.draglist.length)
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
		// console.log('baseLength is ' + baseLength)
		var tempValue = _.first(_.first(this.game.draggedEleString).split(' '), (baseLength - this.game.draglist.length))
		var baseValue = (_.isArray(tempValue) ? tempValue.join(' ') : tempValue)
		// console.log('baseValue is ' + baseValue)
		// console.log(JSON.stringify(list))
		var keyList = _.map(list, helper.getFirstKey)
		var keys = this.sortIds(keyList) //keyList function has been put in helpers module under a predicate function allKeys
		// console.log('keys are ' + keys)
		var selectors = _.map(this.mapSelectors(keys), this.switchARoo)
		// console.log(selectors)
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

	// o.grabRowElements = function(list) {
	// 	var length = $('#deck>img').length
	// 	return _.map(list.reverse(), function (ele) {
	// 		return $('#deck>img').eq(length - ele)
	// 	})
	// }

	o.idList = function(array) {
		return _.map(array, function (ele) {
			return $(ele).attr('id')
		})
	}

	o.initialCondition = function(element, newgame, loadgame, alwayscb) {
		return $(element).attr('id') == 'new-game' ? ($('#initial>button').css('display', 'none'), $('#difficulty>button').css('display', 'inline'), $('#cheating>button').css('display', 'none')) : 
		$(element).attr('id') == 'load-game' ? ($('#initial>button').css('display', 'inline'),  $('#difficulty>button').css('display', 'none'), $('#cheating>button').css('display', 'inline'), loadgame(), alwayscb()) : 
		($('#initial>button').css('display', 'inline'),  $('#difficulty>button').css('display', 'none'), $('#cheating>button').css('display', 'inline'), newgame($(element).attr('id')), alwayscb())
	}

	o.insertDeckCard = function(determiner, selector, range, defaultOffset, parent, deferred, callback, args) {
		console.log('called')
		if (_.isEmpty(this.game.list)) 
			_.extend(this.game, {'list' : range})
		var baseSelector = $(selector).eq(0)
		var zIndex = baseSelector.length == 0 ? 2 : baseSelector.zIndex()
		var offset = baseSelector.length == 0 ? defaultOffset : baseSelector.offset()
		var src = '/Img/spider/dealer.gif'
		var id = baseSelector.length == 0 ? 'deckCard96' : ('deckCard' + (+helper.extractNumber(baseSelector.attr('id')) - 1))
		var htmlString = html.buildHTML('img', [{'z-index' : zIndex}, {'left' : offset['left']}, {'top' : offset['top']}], [{'src' : src}, {'id' : id}])
		var alternateString = html.buildHTML('img', null , [{'src' : src}, {'id' : id}])
		baseSelector.length == 0 ? parent.append(htmlString) : helper.existy(determiner) ? baseSelector.before(alternateString) : baseSelector.before(htmlString)
		_.extend(this.game, {'list' : _.rest(this.game.list)})
		return _.isEmpty(this.game.list) ? this.clearIntervals(deferred, callback, null, args) : this.game
	}

	o.intervals = function(func, speed, deferred, successcb, failcb, args) {
		var intervals = this.game.intervals
		return _.extend(this.game, {'intervals' : intervals.concat.apply([],[intervals, window.setInterval(func, speed, deferred, successcb, failcb, args)] )})
	}

	o.keyDownAdd = function(key) {
		var newKey = [].concat.call([], this.game.keys, key)
		return _.extend(this.game, {'keys' : newKey})
	}

	o.keyDownEvent = function(prop, deferred, successcb, failcb) {
		var move = _.last(this.game.movelist)
		// var deckCard = _.pick(move.oldHoverCard, 'deckcard')
		// var row = _.pick(move, 'row')
		var row = _.pick(move, prop)
		// return _.isEmpty(deckCard) && _.isEmpty(row) ? deferred.resolve(move).done(successcb) : deferred.reject(move).fail(failcb)
		return _.isEmpty(row) ? deferred.resolve(move).done(successcb) : deferred.reject(move).fail(failcb)
	}

	o.loadGame = function(successcb, failcb) {
		var id = $('.gameboard').attr('id')
		var slot = _.isEmpty($('#game').val()) ? 1 : $('#game').val()
		return $.ajax({
			contentType : 'application/json',
			dataType : 'json',
			type : 'post',
			url : '/loadgame/' + id,
			data : JSON.stringify({slot : +slot}),
			success : function(data) {
				return _.has(data, 'error') ? failcb(data) : successcb(data)
			},
			error: function(error) {
				console.log(error)
			}
		})
	}

	o.mapSelectors = function(array) {
		return _.map(array, function (ele) {
			return $('#' + ele)
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

	o.moveCard = function(selector, list, deferred, callback, args) {
		if (_.isEmpty(this.game.list)) 
			this.defaulted(list, 'list')
		var offset = $(selector).offset()
		$(_.first(list)).animate({
			left : offset['left'],
			top : offset['top']
		}, {duration : 100})
		this.defaulted(_.rest(this.game.list), 'list')
		return _.isEmpty(this.game.list) ? that.clearIntervals(deferred, callback, null, args) : list
	}

	o.objectList = function(list) { // expects a list of offsets
		if (!_.isArray(list)) 
			list = _.toArray(arguments)
		var idList = _.map(list, function (ele) {
			return $(that.switchARoo(ele)).attr('id')
		}) // gets a list of ids
		var dataList = _.reduce(this.game.data, function (memo, ele) {
			return memo.concat(_.pick(ele, _.values(idList)))
		}, []) // returns an array of objects that matches the array of ids
		var objectList = _.reduce(dataList, function (memo, ele) {
			return _.isEmpty(ele) ? memo : [].concat.call([], memo, ele)
		}, []) // filters out empty objects
		var hoverElements = _.reduce(objectList, function (memo, ele, ind, arr) {
			return _.isEqual(_.values(ele), _.values(_.last(arr))) ? [].concat.call([], memo, ele) : memo
		}, []) // returns an array of data objects that match the hover element
		return _.last( hoverElements, _.values(_.last(hoverElements)).join('').split(' ').length) // returns the last n elements based on the length of the length of the data value
	}

	o.offsetCheck = function(successcb, failcb) {
		var args = _.rest(arguments, 3)
		return helper.arrayCheck(this.game.fullOffsetList, successcb, failcb)
	}

	o.populateBoard = function(obj) {
		$('#deck').html(obj.game.deckHTML)
		$('#bottomDeck').html(obj.game.cardStackHTML)
		for (prop in obj.game) {
			if (obj.game.hasOwnProperty(prop)) 
				that.game[prop] = obj.game[prop]
		}
		return that.game
	}

	o.pseudoValues = function(list) {
		var index = _.rest(arguments)
		var previousRowKeys = this.buildList(this.game.previousRow)
		var currentRowKeys = this.buildList(this.game.currentRow)
		var list = (helper.existy(list) ? list.droppables : list)
		var previousRowArray = _.map(previousRowKeys, function (elem) {
			return _.reduce(that.game.data, function (memo, ele) {
				return helper.getFirstKey(ele) == elem ? [].concat.call([], memo, ele) : memo
			}, [])
		})
		var currentRowArray = _.map(currentRowKeys, function (elem) {
			return _.reduce(that.game.data, function (memo, ele) {
				return helper.getFirstKey(ele) == elem ? [].concat.call([], memo, ele) : memo
			}, [])
		})
		var previousRowData = helper.flatten(previousRowArray)
		var currentRowData = helper.flatten(currentRowArray)
		var previousRowMatches = this.valueByIndex(list, previousRowData, _.first(index))
		console.log(_.first(index))
		console.log(list)
		console.log(previousRowData)
		console.log(currentRowData)
		
		if (!_.isEmpty(previousRowMatches)) {
			console.log(previousRowMatches)
		}
		if (_.isEmpty(previousRowMatches)) {
			return _.extend(this.game, {'pseudoDragged' : [], 'pseudoHovered' : []})
		}
		return _.reduce(previousRowMatches, function (memo, ele, index) {
			var currentRowObject = currentRowData[ele]
			if (_.isObject(ele) && helper.stringLength(helper.getFirstValue(ele)) > 1) {
				var offsets = that.calculateLeft(that.switchARoo('#' + helper.getFirstKey(ele)))
				var list = that.recursiveGrouping(offsets, [])	
				var eles = _.map(_.last(list), that.switchARoo)	
				var ids = that.idList(eles)
				var data = _.map(ids, function (elem) {
					return _.reduce(that.game.data, function (memo, ele) {
						return helper.getFirstKey(ele) == elem ? [].concat.call([], memo, ele) : memo
					}, [])				
				})
				var array = helper.flatten(data)
				return _.extend(memo, {'pseudoHovered' : array})
			} else if (_.isObject(ele)) {
				return _.extend(memo, {'pseudoHovered' : ele})
			} else {
				return _.extend(memo, {'pseudoDragged' : currentRowObject})
			}
		}, this.game)
	}

	o.ranger = function(selector, determiner, range) {
		var div = $(selector).length
		return determiner == 'last' ? _.range( (div - range), div ) : _.range(range)
	}

	o.rebuildDeckCard = function() {
		var card = _.last(this.game.movelist).oldHoverCard
		var htmlString = html.buildHTML('img', [{'z-index' : card.zindex}, {'left' : card.offset.left}, {'top' : card.offset.top}], [{'src' : card.src}, {'id' : card.id}])
		var removedCard = document.elementFromPoint(card.offset.left, card.offset.top)
		$(removedCard).fadeOut({ duration: 250, complete: function() {
			$('#deck>img').eq(card.index).before(htmlString)
		}})
		$(removedCard).promise().done(function(){
			$(removedCard).remove()
		})
	}

	o.recursiveGrouping = function(offsets, list) {
		if (_.isEmpty(offsets))
			return list
		else {
			// console.log(offsets)
			var off = _.first(offsets)
			var item = $(this.switchARoo(off)).attr('id')
			var data = _.reduce(this.game.data, function (memo, ele) {
				return helper.getFirstKey(ele) == item ? [].concat.call([], memo, ele) : memo
			}, [])
			var datalength = helper.stringLength(_.values(_.first(data)))
			var elements = _.first(offsets, datalength)
			// console.log(elements)
			var remainingElements = (offsets.length - datalength == 0 ? [] : _.last(offsets, (offsets.length - data.length)))
			// console.log('remaining elements')
			// console.log(remainingElements)
			return this.recursiveGrouping(remainingElements, [].concat.call([], list, [elements]))
		}
	}

	o.removeElements = function(list, selector) { // give a range of elements for list and a jquery element for selector
		return _.map(list.reverse(), function (ele) {
			return $(selector).eq(ele).remove()
		})
	}

	o.removeMove = function() {
		var length = this.game.movelist.length
		var moves = _.first(this.game.movelist, (length - 1))
		return _.extend(this.game, {'movelist' : moves} )
	}

	o.revertCard = function(list, offset, callback) {
		var card = _.first(list) instanceof HTMLElement ? _.first(list) : _.first(this.mapSelectors(list))
		var list = _.first(list) instanceof HTMLElement ? list : this.mapSelectors(list)
		var offset = _.isArray(offset) ? _.first(offset) : offset
		$(card).animate({
			left : offset['left'],
			top : offset['top']
		}, 
		{progress : function() {
			that.revertEvent(list, $(card), null)
		}})
		return callback ? $(card).promise().done(callback) : $(card).promise()
	}

	o.undoMove = function(callback) {
		var move = _.last(this.game.movelist)
		return this.revertCard(move.draggedElements, move.draggedEleOffsets, callback)
	}

	o.revertStack = function(move, callback) {
		var move = move.completedStack
		return this.revertCard(move.elements, move.offsets, callback)
	}

	o.moveCompletedStack = function(list, callback) {

		if (_.isEmpty(list))
			return 'nothing to do'
		// console.log(list)
		return this.revertCard(list, $('#2').offset(), callback)
	}

	o.revertEvent = function(list, ele, deferred, cb) {
		var base = $(ele).offset()
		var offset = (_.isEmpty(this.game.initialOffset) ? _.first(_.last(this.game.movelist).draggedEleOffsets) : this.game.initialOffset)
		_.map(list, function (element, ind) {
			$(element).css({
				left : base['left'],
				top : +base['top'] + (ind * 20)
			})
		})
		return _.isEqual($(ele).offset(), offset) && helper.existy(deferred) ? this.clearIntervals(deferred, cb) : this
	}

	o.unacceptableDraggable = function(ele, deferred, cb) {
		return this.revertEvent(this.game.draglist, ele, deferred, cb)
	}

	o.resetStackHTML = function() {
		var selectors = _.reduce(this.game.stackSelectors, function (memo, ele) {
			return $(ele).length > 1 ? [].concat.call([], memo, ele) : memo
		}, [])
		var selectorOffsets = _.map(this.game.stackSelectors, function (ele, index, array) {
			return $(ele).eq(0).offset()
		})
		var offsets = _.reduce(selectorOffsets, function (memo, ele) {
			var gameOffsets = _.reduce(that.game.fullOffsetList, function (mem, elem) {
				return _.isEqual(ele, elem) ? [].concat.call([], mem, elem) : mem
			},[])
			return [].concat.call([], memo, [gameOffsets])
		}, [])
		console.log(offsets)
		return _.each(offsets, function (ele, index) {
			console.log(ele)
			return _.isEmpty(ele) ? $(selectorOffsets[index]).eq(0).remove() : false
		})
		// console.log(flatten)
		// console.log(selectors)
		// return _.each(selectors, function (ele) {
		// 	$(ele).eq(0).remove()
		// })
	}

	o.revertRow = function(selector, defaultOffset, deferred, callback) {
		var list = _.last(this.game.movelist).rowCards
		if (_.isEmpty(this.game.list)) 
			_.extend(this.game, {'list' : list})
		var offset = $(selector).length == 0 ? defaultOffset : $(selector).offset()
		this.revertCard([_.first(this.game.list)], [offset])
		_.extend(this.game, {'list' : _.rest(this.game.list)})
		return _.isEmpty(this.game.list) ? this.clearIntervals(deferred, callback) : this.game
	}

	o.revertZIndex = function(prop) {
		var list = this.game[prop]
		var base = $(document.elementFromPoint(this.game.initialOffset['left'], (+this.game.initialOffset['top'] - 5) )).zIndex()
		// console.log(base)
		return _.map(list, function (ele, ind){
			return $(ele).zIndex(base + ind + 1)
		})
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
		var extra = ['any', 'any', 'any', 'any', 'any', 'any', 'any', 'any']
		return _.extend(this.game, {'shuffledDeck' : [].concat.call([], extra, array)})
	}

	o.sortIds = function(array) {
		return array.sort(function (a, b) {
			var firstOffset = $('#' + a).offset()
			var secondOffset = $('#' + b).offset()
			return firstOffset['top'] - secondOffset['top']
		})
	}

	o.sortOffsets = function(array) {
		return array.sort(function (a, b) {
			return a['top'] - b['top']
		})
	}

	o.stackLocation = function() {
		var locations = ['#stack1>img', '#stack2>img', '#stack3>img', '#stack4>img', '#stack5>img', '#stack6>img', '#stack7>img', '#stack8>img']
		var stack = _.reduce(locations, function (memo, ele) {
			return $(ele).length == 1 ? [].concat.call([], memo, ele) : memo
		}, [])
		return _.first(stack)
	}

	o.switchARoo = function(item) { // returns offset if given a jquery element else it returns a DOM element
		return _.has(item, 'left') ? document.elementFromPoint(item['left'], item['top']) : $(item).offset()
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
		var val = _.isEmpty($('#game').val()) ? 1 : $('#game').val()
		return $.ajax({
			contentType : 'application/json' ,
			type : 'post',
			url : '/update/' + id,
			data : JSON.stringify({game : that.game, slot : +val}),
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

	o.updateData = function(deferred, move, failcb, successcb) {
		// console.log(this.game.draggedEleString)
		var draglist = (_.has(this.game, 'draglist') ? this.game.draglist : [this.game.clicked])
		// console.log(draglist)
		if (_.toArray(arguments).length == 1) {
			return this.updateElementData(this.game.elementlist, this.game.fullBaseValue, this.game)
		}
		else if (helper.existy(move)) {
			var move = _.last(this.game.movelist)
			return _.has(move, 'row') ? (this.updateElementData(move.matchedDragged, move.draggedData, this.game),
										this.updateElementData(move.matchedHovered, move.hoveredData, this.game)) :
										(this.updateElementData(move.draggedElements, move.draggedEleString, this.game),
										this.updateElementData(move.hoverElements, move.hoverString, this.game))
		}
		else if (_.first(this.game.draggedEleString).split(' ').length > draglist.length) {
			return deferred.reject().fail(failcb, successcb)
		} else {
			// console.log(this.game.elementlist)
			// console.log(this.game.fullBaseValue)
			return (this.updateElementData(this.game.elementlist, this.game.fullBaseValue, this.game), deferred.resolve().done(successcb))
		}
	}

	o.updateElementData = function(list, value, obj) {
		if (_.isObject(_.first(value))) {
			value = _.map(value, helper.getFirstValue)
		} else if (typeof value == 'string' || value.length < list.length) {
			var array = _.isArray(value) ? value.join(' ').split(' ') : value.split(' ')
			value = _.map(_.range(array.length), function (ele) {
				return value
			})
		} else {
			value = value
		}
		console.log(list), console.log(value)
		return _.map(obj.data, function (ele, index) {
			return helper.anyKey(list, ele) ? obj.data[index] = helper.createObject(helper.whichKey(list, ele), helper.whichValue(value, list, ele)) : ele
		})
	}

	o.updateDataKeys = function() {
		var data = helper.updateDataSet(this.game.identity, this.game.data)
		return _.extend(this.game, {'data' : data})
	}

	o.updateSingleOffset = function(object) {
		var id = $(object).attr('id')
		var offset = this.switchARoo(object)
		return _.map(this.game.identity, function (ele, index) {
			return helper.getFirstKey(ele) == id ? that.game.fullOffsetList[index] = offset : ele
		})
	}

	o.validDroppable = function(value) {
		return (!isNaN(value) && +value != 10) ? (+value + 1).toString() : this.edgeCase(value)
	}

	o.valueByIndex = function(value, array, ind) {
		return _.reduce(array, function (memo, ele, index) {
			var val = helper.stringLength(helper.getFirstValue(ele)) > 1 ? _.last(helper.getFirstValue(ele).split(' ')) : helper.getFirstValue(ele)
			return ((index == ind) && (_.contains(value,val))) ? [].concat.call([], memo, ele, index) : memo
		}, [])
	}

	var addToProto = function(obj, baseObj) {
		for (prop in baseObj)
			obj.prototype[prop] = baseObj[prop]
	}

	addToProto(Spider,o)
}