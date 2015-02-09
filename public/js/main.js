function Spider() {
	var initial = {'cards' : ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], 'intervals' : [], 'list' : [], 'data' : [], 'draglist' : [], 'identity' : [],
			'droppables' : [], 'fullOffsetList' : [], 'movelist' : [], 'keys' : [], 'hoverMatches' : [], 'clickedMatches' : [], 'hoveredData' : [], 'draggedData' : [],
			'draggedEleString' : [], 'shuffledDeck' : [], 'ImageDimensions' : {'height' : 96, 'width' : 71}, 'allowEvent' : ''};

	var o = {'game' : initial}
	
	var that = this

	o.buildDragList = function(list) {
		var offset = this.game.initialOffset
		var items = _.reduce(list, function (memo, element) {
			return (element['top'] >= offset['top']) ? [].concat.call([], memo, element) : memo
		}, [])
		return items.sort(function (a, b){
			return a.top - b.top
		}) 
	}

	o.buildValueList = function(value, ele) {
		var suits = _.uniq(this.game.suits)
		var val =  _.map(suits, function (ele) {
			return value == null ? value : [value, ele].join('')
		})
		return helper.existy(_.first(val)) ? _.extend(this.game, {'droppables' : val, 'initialOffset' : $(ele).offset()}) : [null]
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

	o.determination = function(special, index) {
		return $(special).eq(index).offset()
	}

	o.determineHoverElement = function(ele) {
		var left = ele['left'],
			top = ele['top'],
			d = this.game.ImageDimensions,
			list = _.reduce(this.game.offsets, function (memo, e) {
			return (e['left'] + d['width'] - 41 > left) && (e['left'] - 26 < left) && 
			(Math.abs(top - e['top']) >= 0) && (Math.abs(top - e['top'] <= 70)) && !_.isEqual(that.game.initialOffset, e) ?
			[].concat.call([], memo, e) : memo
		}, [])
		return _.isEmpty(list) ? [] : _.first(list)
	}

	o.defaulted = function(value) {
		var props = _.rest(arguments, 1)
		return helper.defaultValues.apply(this, [this.game, value, props])
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
				var temp = _.map(that.game.droppables, helper.getFirstValue)
				var list = _.map(temp, function (ele) {
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
			return _.has(ele, id) ? ele : memo
		})
	}

	o.extractCard = function(identity) {
		var card = _.values(identity).join('').split('')
		return card.length > 2 ? _.first(card, 2).join('') : _.first(card)
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

	o.intervals = function(callback, speed, deferred, successcb, failcb) {
		var intervals = this.game.intervals
		return _.extend(this.game, {'intervals' : intervals.concat.apply([],[intervals, window.setInterval(callback, speed, deferred, successcb, failcb)] )})
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

	o.populateBoard = function(obj) {
		$('#deck').html(obj.game.deckHTML)
		$('#bottomDeck').html(obj.game.cardStackHTML)
		for (prop in obj.game) {
			if (obj.game.hasOwnProperty(prop)) 
				that.game[prop] = obj.game[prop]
		}
		return this.game
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

	o.validDroppable = function(value) {
		return (!isNaN(value) && +value != 10) ? (+value + 1).toString() : this.edgeCase(value)
	}

	var addToProto = function(obj, baseObj) {
		for (prop in baseObj)
			obj.prototype[prop] = baseObj[prop]
	}

	addToProto(Spider,o)
}