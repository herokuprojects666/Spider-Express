function addMove(row) {
	var movelist = existy(row) ? [].concat.call(obj.movelist, {'row' : true, 'rowCards' : row, 'matchedDragged' : obj.clickedMatches, 'matchedHovered' : obj.hoverMatches,
												 'hoveredData' : obj.hoveredData, 'draggedData' : obj.draggedEleString})
								 : [].concat.call(obj.movelist, {'oldHoverCard' : obj.oldHoverCard, 'hoverString' : obj.hoverString, 'hoverElements' : obj.hoverElements,
												 'draggedElements' : obj.draggedElements, 'draggedEleString' : obj.draggedEleString, 'draggedEleOffsets' : obj.draggedEleOffsets})	
	return _.extend(obj, {'movelist' : movelist, 'clicked' : [], 'clickedMatches' : [], 'currentRow' : [], 'draggedData' : [], 'draggedEleOffsets' : [], 
						  'draggedEleString' : [], 'draggedElements' : [], 'elementlist' : [], 'hoverElements' : [], 'hoverMatches' : [], 'hovered' : [], 'hoveredData' : []})
}

// function anyKey(list, obj) { // pass in list of keys, returns true if object has any properties in list
// 	var array = _.map(list, function (ele) {
// 		return _.has(obj, ele)
// 	})
// 	return _.some(array, function (ele) {
// 		return ele == true
// 	})
// }

// function anyValue(values, list) { // search for a group of values within list
// 	return _.map(values, function (ele) {
// 		return _.contains(list, ele)
// 	})
// }

// function arrayOfArray(array) { // flattens an array to one level
// 	var reduced = function(list) {
// 		if (_.some(list, _.isArray)) {
// 			var reducing = _.reduce(list, function (memo, ele) {
// 				return memo.concat(ele)
// 			}, [])
// 			return reduced(reducing)
// 			}		
// 		else 
// 			return list
// 	}
// 	return reduced(array)
// }

function atts(att1, att2, att3) {
	var args = _.toArray(arguments)
	switch (args.length) {
		case 1 : 
		return ' ' + _.keys(att1) + '="' + _.values(att1) + '"'
		break
		case 2 : 
		return ' ' + _.keys(att1) + '="' + _.values(att1) + '" ' + _.keys(att2) + '="' + _.values(att2) + '"'
		break
		case 3 :
		return ' ' + _.keys(att1) + '="' + _.values(att1) + '" ' + _.keys(att2) + '="' + _.values(att2) + '" ' + _.keys(att3) + '="' + _.values(att3) + '"'  
	}
}

// function booleanArray(array, value) {
// 	if (!_.isArray(array))
// 		return array
// 	var booleans = _.map(array, function (ele) {
// 		return _.isEqual(ele, value) ? true : false
// 	})
// 	return _.contains(booleans, true) ? true : false
// }

function buildDragList(list, obj) {
	var offset = obj.initialOffset
	var items = _.reduce(list, function (memo, element) {
		return (element['top'] >= offset['top']) ? memo.concat(element) : memo
	}, [])
	return items.sort(function (a, b){
		return a.top - b.top
	}) 
}

function buildHTML(tag, stylez, attributes, innerhtml) {
	return !existy(stylez) ? '<' + tag + ' ' + htmlGen(atts, attributes) + '>' + ' ' + innerhtml +  ' </' + tag + '>' 
						   : '<' + tag + ' ' + htmlGen(styles, stylez) + htmlGen(atts, attributes) + '>' + ' ' + innerhtml +  ' </' + tag + '>' 

	// return '<' + tag + ' ' + htmlGen(styles, stylez) + htmlGen(atts, attributes) + '/' + tag + '>'
}

function buildList (list) { //expects a list of objects or a list of dom elements
	return _.map(list, function (ele) {
		return _.isArray(ele) ? _.reduce(ele, function (memo, elem) { return memo.concat($(elem).attr('id'))}, []) : 
		_.first(_.keys(ele))
	})
}

function buildValues(list, hoverData) { // hoverdata is a list of objects, list is a list of dom elements
	var baseValue = _.values(_.first(hoverData))
	var hoverElements = sortIds(buildList(hoverData))
	var otherElements = sortIds(buildList(list))
	otherElements = (_.some(otherElements, _.isArray) ? arrayOfArray(otherElements) : otherElements)
	var fullList = [].concat.apply([], [hoverElements, otherElements])
	var draggedOffsets = _.map(otherElements, function (ele, index) {
		return _.isEmpty(obj.initialOffset) ? {} : {'left' : obj.initialOffset['left'], 'top' : (+obj.initialOffset['top'] + (index * 20))}
	})
	var otherBaseValue = _.reduce(obj.data, function (memo, ele) {
		return $(_.first(list)).attr('id') == _.first(_.keys(ele)) ? memo.concat(ele) : memo
	}, [])
	var uniqueString = _.uniq((baseValue + ' ' + _.values(_.first(otherBaseValue))).split(' ')).join(' ')
	return _.extend(obj, {'elementlist' : fullList, 'draggedEleString' : [].concat.call([], obj.draggedEleString, _.values(_.first(otherBaseValue))), 'fullBaseValue' : uniqueString,
	'hoverElements' : hoverElements, 'draggedElements' : otherElements, 'hoverString' : baseValue, 'draggedEleOffsets' : draggedOffsets})
}

function buildValueList(value) {
	var suits = _.uniq(obj.suits)
	return _.map(suits, function (ele) {
		return value == null ? value : [value, ele].join('')
	})
}

function calculateLeft(obj, element) {
	var offset = (element ? element : obj.initialOffset)
	var reduced = _.reduce(obj.fullOffsetList, function (memo, elem) {
		return elem['left'] == offset['left'] ? memo.concat(elem) : memo
	}, [])
	return reduced.sort(function (a,b) {
		return a['top'] - b['top']
	})
}

function calculateOffset(obj) {
	var deck = $('#deck>img')
	var list = _.map(deck, function(ele) {
		return $(ele).offset()
	})
	var left = _.map(list, function(ele) {
		return ele['left']
	})
	var duplicateFree = _.uniq(left)
	var ArrayofArray = _.map(duplicateFree, function (ele) {
		return _.reduce(list, function (memo, element) {
			return element['left'] == ele ? memo.concat(element) : memo
		}, [])
	})
	var sorted = _.map(ArrayofArray, function (ele) {
		return _.first(ele.sort(function (a, b) {
			return b['top'] - a['top']
		}))
	})
	return _.extend(obj, {'offsets' : sorted})
}

// function chainer(obj) { //use to chain together a list of function calls
// 	var arg = _.toArray(arguments)
// 	var funcs = _.reduce(arg, function (memo, ele) {
// 		return _.isFunction(ele) ? memo.concat.apply(memo, [ele]) : memo
// 	}, [])
// 	var params = _.reduce(arg, function (memo, ele, index) {
// 		return (!_.isFunction(ele) && index > 0) ? memo.concat.apply(memo, [ele]) : memo
// 	}, [])
// 	return _.reduce(funcs, function (memo, ele) {
// 		return ele.call(null, memo, params)
// 	}, obj)
// }

// function check(array, successcb, failcb) {
// 	return _.isEmpty(array) ? successcb.call(null, obj) : failcb.call(null, obj)
// }

// function checkForKeys(requiredKeys, keylist) {
// 	var array = anyValue(requiredKeys, keylist)
// 	return _.every(array)
// }

function clearIntervals(deferred, successcb, failcb) {
	_.map(obj['intervals'], function(ele) {
				window.clearInterval(ele)})	
	_.extend(obj, {'intervals' : []})
	if (!existy(failcb)) {
		deferred.resolve()
		return deferred.promise().done(successcb)
	}
}

// function compareOffsets(input, compareAgainst, determiner, cb) {
// 	var temp = _.reduce(compareAgainst, function (memo, ele, index, arr) {
// 		if (existy(determiner))
// 			return _.isEqual(ele, input) && determiner(arr, index) ? memo.concat.call(memo, true) : memo
// 		else 
// 			return _.isEqual(ele, input) ? memo.concat.call(memo, true) : memo
// 	}, [])
// 	return _.contains(temp, true) ? cb(true) : cb(input, compareAgainst)
// }

// function convertId(ele) { // returns the object key
// 	return _.first(_.keys(ele))
// }

// function convertValue(ele, index, array) { // returns the object value
// 	return _.first(_.values(ele))
// }

function createDeck(obj, suits) {
	var cardList = obj.cards
	var list = _.map(suits, function (ele, ind, arr) {
		return _.map(cardList, function (elem) {
			return [elem, ele].join('')
		})
	})
	_.extend(obj, {'suits' : suits})
	return _.reduce(list, function (memo, ele) {
		return memo.concat(ele)
	})
}



// function createObject(property, value) { // returns an object with the property and value given
// 	var object = new Object
// 	var prop = property
// 	object[prop] = value
// 	return object
// }

// function curry(func, arg) {
// 	var args = _.rest(arguments, 2)
// 	var arg = (existy(arg) ? arg : [])
// 	var finalArgs = [].concat.apply([], [args, arg])
// 	return func.apply(null, finalArgs)
// }

function dataCheck(obj) {
	var array = _.map(obj.data, function (ele) {
		return (_.first(_.values(ele)) == 'undefined' || _.first(_.values(ele)) == undefined) ? true : false
	})
	return _.some(array)
}

function dealDeck(card, placeholder, list, obj, deferred, callback) {
	var offset;
	if(_.isEmpty(obj.list)) 
		_.extend(obj, {'list' : list})
	$('#' + placeholder + _.first(obj.list)).length == 0 ? 
	(offset = determination('#bottomDeck>img', 0)) : 
	(offset = $('#' + placeholder + _.first(obj.list)).offset())
	$('#' + card + _.first(obj.list)).animate({
		left : offset['left'],
		top : offset['top']
	})

	_.extend(obj, {'list' : _.rest(obj.list)})

	if(_.isEmpty(obj.list))
		clearIntervals(obj, deferred, callback)
}

function dealRow(list, deferred, callback) {
	if (_.isEmpty(obj.list)) 
		_.extend(obj, {'list' : list})	
	$('#bottomDeck>img').eq(_.first(obj.list)).animate({
		top : 20 + (+obj.offsets[_.first(obj.list)]['top']),
		left : obj.offsets[_.first(obj.list)]['left']
	})
	_.extend(obj, {'list' : _.rest(obj.list)})
	if (_.isEmpty(obj.list))
		return clearIntervals(obj, deferred, callback)
}

function deckCard(obj, position, deferred, alwayscb) {
	var card = document.elementFromPoint(obj.initialOffset['left'], obj.initialOffset['top'])
	var length = $("#deck>img[id*='card']")  
	extractString($(card)) != 'deckCard' ? deferred.reject().fail(alwayscb) : $(card).fadeOut({ duration : 250, complete: function() {
		var deck = _.reduce(obj.shuffledDeck, function (memo, ele, ind) {
			return ind == position ? memo.concat(ele) : memo
		}, [])
		var offset = {'left' : +obj.initialOffset['left'], 'top' : (+obj.initialOffset['top'] - 20)}
		var src = '/Img/spider/dealer.gif'
		var id = 'deckCard' + (+position + 1)
		_.extend(obj, { 'oldHoverCard' : {'index' : position, 'zindex' : $(card).zIndex(), 'offset' : offset, 'deckcard' : true, 'src' : src, 'id' : id, 'data' : deck.join('')}})
		$('#deck>img').eq(position).before('<img ' + htmlGen(styles, [{'z-index' : $(card).zIndex()}, {'left' : obj.initialOffset['left']}, {'top' : (+obj.initialOffset['top'] - 20)}]) + htmlGen(atts, [{'class' : deck.join('')}, {'src' : ('/Img/spider/' + deck.join('') + '.gif')}, {'id' : ('card' + (length.length+1) )} ]) + '>')
	}})
	$(card).promise().done(function() {
		extractString($(card)) == 'card' ? null : $(card).remove()
		deferred.resolve().done(alwayscb)
	})
}

function determination(special, index) {
	return $(special).eq(index).offset()
}

function determineHoverElement(ele, obj) {
	var left = ele['left'],
		top = ele['top'],
		d = obj.ImageDimensions,
		list = _.reduce(obj.offsets, function (memo, e) {
		return (e['left'] + d['width'] - 41 > left) && (e['left'] - 26 < left) && 
		(Math.abs(top - e['top']) >= 0) && (Math.abs(top - e['top'] <= 70)) && !_.isEqual(obj.initialOffset, e) ?
		memo.concat(e) : memo
	}, [])
	return _.isEmpty(list) ? [] : _.first(list)
}

function determineMove(object, failcb, successcb) {
	return _.has(object, 'row') ? failcb(object) : successcb(object)
}

function determinePosition(obj) {
	var item = switchARoo([obj.initialOffset]),
		id = $(_.first(item)).attr('id'),
		index = _.reduce(obj.identity, function (memo, ele, index) {
		return _.has(ele, id) ? memo.concat(index) : memo
	}, [])
	return index.join('')
}

function difficulty(level) {
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

function dragging(obj, failcb, successcb) {
	var ele = obj.clicked
		list = arrayOfArray(obj.draglist)

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
			var hoverElement = obj.hovered
			var list = _.map(obj.droppables, function (ele) {
				return _.first(_.values(extractIdentity($(hoverElement)))) == ele ? 'true' : 'false'
			})
			return _.every(list, function (ele) {
				return ele == 'true'
			}) ? (successcb(obj), false) : (failcb(obj), true)			
		}
	})	
}

function edgeCase(value) {
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

function existy(x) {
  return x != null
}

// function extendObj(obj, value) {
// 	var args = _.rest(arguments, 2)
// 	var mappedProps = _.map(args, function (ele) {
// 		return obj.hasOwnProperty(ele) ? obj[ele] = value : obj
// 	})
// 	return obj
// }

function extractCard(identity) {
	var card = _.values(identity).join('').split('')
	return card.length > 2 ? _.first(card, 2).join('') : _.first(card)
}

function extractIdentity(ele) {
	var id = $(ele).attr('id')
	return _.reduce(obj.identity, function (memo, ele) {
		return _.has(ele, id) ? ele : memo
	})
}

// function extractNumber(string) {
// 	return _.reduce(string.split(''), function (memo, ele) {
// 		return !isNaN(+ele) ? memo += ele : memo
// 	}, '')
// }

function extractString(ele) {
	var id = $(ele).attr('id')
	var string = _.map(id.split(''), function (ele) {
		return isNaN(ele) ? ele : ''
	})
	return string.join('')
}

function generateBoard(deck, rows, columns) {
	var board = '', 
		beginningRow = '<div class="row">',
		beginningCards = '',
		deckCard = '',
		bottomDeck = '',		
		deck = deck.shuffledDeck,
		initialDeck = deck.length

	_.each(rows, function (ele, ind) {
		board += '<div ' + htmlGen(atts, [{'class' : 'row'}, {'id' : 'row' + ind}]) + '>'
		_.each(columns, function (elem, index) {
			board += '<img ' + htmlGen(styles, [{'z-index' : 1}]) + htmlGen(atts, [{'src' : '/Img/spider/fake.gif'}, {'id' : 'placeholder' + (ind * columns.length + index + 1)}]) + '>'
			deckCard += '<img' + htmlGen(styles, [{'z-index' : 2}]) + htmlGen(atts, [{'src' : '/Img/spider/dealer.gif'}, {'id' : 'deckCard' + (ind * columns.length + index + 1)}]) + '>'
			ind == 0 ? beginningRow += '<img' + htmlGen(styles, [{'z-index' : 1}]) + htmlGen(atts, [{'src' : '/Img/spider/fake.gif'}, {'id' : 'clickable' + (index + 1)}]) + '>' : false
			ind == 0 ? beginningCards += '<img' + htmlGen(styles, [{'z-index' : 2}]) + htmlGen(atts, [{'class' : deck[(rows.length * columns.length) + index]}, {'src' : '/Img/spider/' + deck[(rows.length * columns.length) + index] + '.gif'}, {'id' : 'card' + (index+1)}]) + '>' : false
		})
		board += '</div>'
	})
	_.each(_.range(initialDeck), function (ele, ind) {
		(ind >= (rows.length * columns.length + 1)) && (ind <= (initialDeck - columns.length)) ? bottomDeck += '<img' + htmlGen(styles, [{'z-index' : 2}]) + htmlGen(atts, [{'src' : '/Img/spider/dealer.gif'}, {'id' : 'deckCard' + ind}]) + '>' : false
	})

	$('#bottomDeck').html(bottomDeck)
	$('#hiding').html(board + beginningRow)
	$('#deck').html(deckCard + beginningCards)	
}

function grabRowElements(list) {
	var length = $('#deck>img').length
	return _.map(list.reverse(), function (ele) {
		return $('#deck>img').eq(length - ele)
	})
}

function fadeOut(list, deferred, duration, selector, secondSelector, successcb, failcb) {
	if (_.isEmpty(obj.list))
		_.extend(obj, {'list' : list})
	$(selector).eq(_.first(obj.list)).fadeOut({duration : duration, complete : function() {
		var z = $(switchARoo(obj.offsets)[$(this).index()]).zIndex()
		var index = $(this).index()
		var length = $('#deck>img').length
		var id = $("#deck>img[id*='card']").length
		if (existy(secondSelector)) {
			$(secondSelector).append('<img ' + htmlGen(styles, [{'z-index' : (+z+1)}, {'left' : obj.offsets[index]['left']}, {'top' : (20 + +obj.offsets[index]['top'])}]) + htmlGen(atts, [{'class' : obj.shuffledDeck[length]}, {'src' : ('/Img/spider/' + obj.shuffledDeck[length] + '.gif')}, {'id' : ('card' + (id+1))}]) + '>')
		}
		if (index == _.last(list)) {
			deferred.reject()
			deferred.promise().fail(failcb)
		} 
	}})
	_.extend(obj, {'list' : _.rest(obj.list)})
	if (_.isEmpty(obj.list)) 
		return clearIntervals(obj, deferred, successcb, failcb)
}

function fixBaseString(obj, list) {
	console.log(obj)
	console.log(list)
	var baseLength = _.first(obj.draggedEleString).split(' ').length
	// console.log(obj.draggedEleString)
	// console.log('baseLength is ' + baseLength)
	var tempValue = _.last(_.first(obj.draggedEleString).split(' '), arrayOfArray(obj.draglist).length)
	// console.log('tempValue is ' + tempValue)
	var baseValue = (_.isArray(tempValue) ? tempValue.join(' ') : tempValue)
	// console.log('baseValue is ' + baseValue)
	var keys = arrayOfArray(buildList(list))
	// console.log('keys are ' + keys)
	_.extend(obj.oldHoverCard, {'oldHoverString' : obj.draggedEleString})
	return _.each(obj.data, function (ele, index) {
		return anyKey(keys, ele) ? (obj.data[index] = createObject(whichKey(keys, ele), baseValue)) : ele
	})
}

function fixCss(obj) {
	var draglist = arrayOfArray(obj.draglist)
	var acceptedDraggable = $(obj.hovered).offset()
	_.each(draglist, function (ele, ind) {
		$(ele).css({
			left : acceptedDraggable['left'],
			top : +acceptedDraggable['top'] + (20 * (ind + 1) )
		})
	})
	return draglist
}

function fixOldData(obj, list) {
	var baseLength = _.first(obj.draggedEleString).split(' ').length
	// console.log('baseLength is ' + baseLength)
	var tempValue = _.first(_.first(obj.draggedEleString).split(' '), (baseLength - arrayOfArray(obj.draglist).length))
	// console.log('tempValue is ' + tempValue)
	var baseValue = (_.isArray(tempValue) ? tempValue.join(' ') : tempValue)
	// console.log('baseValue is ' + baseValue)
	var keys = sortIds(arrayOfArray(keyList(list))) //keyList function has been put in helpers module under a predicate function allKeys
	// console.log('keys are ' + keys)
	var elements = createObject('oldHoverElements', keys)
	_.extend(obj, {'oldHoverCard' : elements})
	return _.each(obj.data, function (ele, index) {
		return anyKey(keys, ele) ? (obj.data[index] = createObject(whichKey(keys, ele), baseValue)) : ele
	})
}

function fixZIndex(list) {
	var base = $(obj.hovered).zIndex()
	return _.map(arrayOfArray(list), function (ele, ind) {
		return $(ele).zIndex(base + ind + 1)
	})
}

function fullOffsetList() {
	var list = _.map(obj.identity, function (ele) {
		return $('#' + _.first(_.keys(ele))).offset()
	})
	return _.extend(obj, {'fullOffsetList' : list})
}

function htmlGen(fun, attributes) { 
	return fun.apply(null, attributes)
}

function idList(array) {
	return _.map(array, function (ele) {
		return $(ele).attr('id')
	})
}

function insertDeckCard(selector, range, defaultOffset, parent, deferred, callback) {
	if (_.isEmpty(obj.list)) 
		_.extend(obj, {'list' : range})
	var baseSelector = $(selector).eq(0)
	var zIndex = baseSelector.length == 0 ? 2 : baseSelector.zIndex()
	var offset = baseSelector.length == 0 ? defaultOffset : baseSelector.offset()
	var src = '/Img/spider/dealer.gif'
	var id = baseSelector.length == 0 ? 'deckCard96' : ('deckCard' + (+extractNumber(baseSelector.attr('id')) - 1))
	var htmlString = buildHTML('img', [{'z-index' : zIndex}, {'left' : offset['left']}, {'top' : offset['top']}], [{'src' : src}, {'id' : id}])
	baseSelector.length == 0 ? parent.append(htmlString) : baseSelector.before(htmlString)
	_.extend(obj, {'list' : _.rest(obj.list)})
	return _.isEmpty(obj.list) ? clearIntervals(obj, deferred, callback) : obj
}

function intervals(obj, callback, speed, deferred, successcb, failcb) {
	var intervals = obj['intervals']
	return _.extend(obj, {'intervals' : intervals.concat.apply([],[intervals, window.setInterval(callback, speed, deferred, successcb, failcb)] )})
}

function keyDownAdd(key) {
	var newKey = [].concat.call([], obj.keys, key)
	return _.extend(obj, {'keys' : newKey})
}

function keyDownEvent(movelist, deferred, successcb, failcb) {
	var move = _.last(movelist)
	var deckCard = _.pick(move.oldHoverCard, 'deckcard')
	var row = _.pick(move, 'row')
	return _.isEmpty(deckCard) && _.isEmpty(row) ? deferred.resolve(move).done(successcb) : deferred.reject(move).fail(failcb)
}

// function keyList(array) { // returns a list of keys for each object in the array
// 	return _.map(array, function (ele) {
// 		return _.keys(ele)
// 	})
// }

// function lastIndex(array, index) {
// 	var length = array.length
// 	return index == (array.length - 1) ? true : false
// }

function mapSelectors(array) {
	return _.map(array, function (ele) {
		return $('#' + ele)
	})
}

function objectList(list) { // expects a list of offsets
	if (!_.isArray(list)) 
		list = _.toArray(arguments)
	var idList = _.map(list, function (ele) {
		return $(switchARoo([ele])).attr('id')
	}) // gets a list of ids
	var dataList = _.reduce(obj.data, function (memo, ele) {
		return memo.concat(_.pick(ele, _.values(idList)))
	}, []) // returns an array of objects that matches the array of ids
	var objectList = _.reduce(dataList, function (memo, ele) {
		return _.isEmpty(ele) ? memo : memo.concat(ele)
	}, []) // filters out empty objects
	var hoverElements = _.reduce(objectList, function (memo, ele, ind, arr) {
		return _.isEqual(_.values(ele), _.values(_.last(arr))) ? memo.concat(ele) : memo
	}, []) // returns an array of data objects that match the hover element
	return _.last( hoverElements, _.values(_.last(hoverElements)).join('').split(' ').length) // returns the last n elements based on the length of the length of the data value
}

function pseudoValues(list) {
	var index = _.rest(arguments)
	var keys = idList(grabRowElements(_.range(9, 17)))
	var previousRowData = _.reduce(obj.data, function (memo, ele) {
		return anyKey(arrayOfArray(_.values(keys)), ele) ? memo.concat(ele) : memo
	},[])
	var currentRowData = _.reduce(obj.data, function (memo, ele) {
		return anyKey(idList(obj.currentRow), ele) ? memo.concat(ele) : memo
	}, [])
	var previousRowMatches = valueByIndex(list, previousRowData, _.first(index))
	console.log(previousRowMatches)
	if (_.isEmpty(previousRowMatches)) {
		return _.extend(obj, {'pseudoDragged' : [], 'pseudoHovered' : []})
	}
	return _.reduce(previousRowMatches, function (memo, ele, index) {
		var currentRowObject = currentRowData[ele]
		return _.isObject(ele) ? _.extend(memo, {'pseudoHovered' : ele}) : _.extend(memo, {'pseudoDragged' : currentRowObject})
	}, obj)
}

// function qualifiers(list) {
// 	var funcs = _.rest(arguments)
// 	return _.map(list, function (ele, index) {
// 		return _.reduce(funcs, function (memo, elem) {
// 			return chainer.call(null, memo, elem, index)
// 		}, ele)
// 	})
// }

function ranger(selector, determiner, range) {
	var div = $(selector).length
	return determiner == 'last' ? _.range( (div - range), div ) : _.range(range)
}

function rebuildDeckCard(move, callback) {
	var card = move.oldHoverCard
	var htmlString = buildHTML('img', [{'z-index' : card.zindex}, {'left' : card.offset.left}, {'top' : card.offset.top}], [{'src' : card.src}, {'id' : card.id}])
	var removedCard = document.elementFromPoint(card.offset.left, card.offset.top)
	$(removedCard).fadeOut({ duration: 250, complete: function() {
		$('#deck>img').eq(card.index).before(htmlString)
	}})
	$(removedCard).promise().done(function(){
		$(removedCard).remove()
		return callback(move)
	})
}

function removeElements(list, selector) { // give a range of elements for list and a jquery element for selector
	return _.map(list, function (ele) {
		return $(selector).eq(ele).remove()
	})
}

function removeMove(object) {
	var length = object.length
	var moves = _.first(object, (length - 1))
	return _.extend(obj, {'movelist' : moves} )
}

function resetDataKeys(obj) {
	var list = obj.identity
	return _.map(obj.data, function (ele, index) {
		return obj.data[index] = createObject(_.first(_.keys(list[index])), _.first(_.values(ele)))
	})
}

function revertCard(list, offset, callback) {
	var card = _.first(mapSelectors(list))
	var list = mapSelectors(list)
	var offset = _.first(offset)
	$(card).animate({
		left : offset['left'],
		top : offset['top']
	}, 
	{progress : function() {
		revertEvent(list, $(card), null)
	}})
	return callback ? $(card).promise().done(callback) : $(card).promise()
}

function revertEvent(list, ele, deferred, cb) {
	var base = $(ele).offset()
	var list = (_.isArray(_.first(list)) ? arrayOfArray(list) : list)
	var offset = (_.isEmpty(obj.initialOffset) ? _.last(_.first(obj.movelist.draggedEleOffsets)) : obj.initialOffset)
	_.map(list, function (element, ind) {
		$(element).css({
			left : base['left'],
			top : +base['top'] + (ind * 20)
		})
	})
	return _.isEqual($(ele).offset(), offset) && existy(deferred) ? clearIntervals(obj, deferred, cb) : obj
}

function revertRow(list, selector, defaultOffset, deferred, callback) {
	if (_.isEmpty(obj.list)) 
		_.extend(obj, {'list' : list})
	var offset = $(selector).length == 0 ? defaultOffset : $(selector).offset()
	revertCard([_.first(obj.list)], [offset])
	_.extend(obj, {'list' : _.rest(obj.list)})
	return _.isEmpty(obj.list) ? clearIntervals(obj, deferred, callback) : obj
}

function revertZIndex(list) {
	var base = $(document.elementFromPoint(obj.initialOffset['left'], (+obj.initialOffset['top'] - 20) )).zIndex()
	return _.map(arrayOfArray(list), function (ele, ind){
		return $(ele).zIndex(base + ind + 1)
	})
}

function separatedList(input, compareTo) {
	var args = _.toArray(arguments)
	if (args.length == 1) 
		return true
	var recursiveGrouping = function (offsets, list) {
		if (_.isEmpty(offsets)) 
			return list
		else 
			var item = $(_.first(switchARoo([_.first(offsets)]))).attr('id')
			var data = _.reduce(obj.data, function (memo, ele) {
				return convertId(ele) == item ? memo.concat.call(memo, ele) : memo
			}, [])
			var datalength = _.values(_.first(data)).join(' ').split(' ').length
			var elements = _.first(offsets, datalength)
			var remainingElements = (offsets.length - datalength == 0 ? [] : _.last(offsets, (offsets.length - datalength)))
			return recursiveGrouping(remainingElements, list.concat.call(list, [elements]))
	}
	return recursiveGrouping(compareTo, [])
}

function setData(obj, identity, cb) {
	_.extend(this.game, {'identity' : []})
	var deck = totalDeck()
	var arr = _.map(deck, function(ele, ind) {
		var object = createObject($(ele).attr('id'), this.game.shuffledDeck[ind])
		return identity ? updateIdentity(object) : 
		_.extend(obj, {'data' : obj.data.concat( object )}) 
	})
	return cb ? cb(obj.data) : arr
}

function setElements(hovered, clicked) {
	var element,
		clicked = document.elementFromPoint(clicked['left'], clicked['top'])
		dealer = $('.dealer').offset()
	_.isEmpty(hovered) ? element = document.elementFromPoint(dealer['left'], dealer['top']) : 
						 element = document.elementFromPoint(hovered['left'], hovered['top'])
	return _.extend(obj, {'clicked' : clicked, 'hovered' : element})
}

function setRowOffset(element) {
	var dragged = document.getElementById(_.first(_.keys(_.first(element.pseudoDragged))))
	var hovered = document.getElementById(_.first(_.keys(_.first(element.pseudoHovered))))
	var drag = switchARoo([dragged])
	return _.extend(obj, {'initialOffset' : _.first(drag), 'clicked' : dragged, 'hovered' : hovered, 'draglist' : drag} )
}

// function shuffleDeck(passedDeck) {
// 	return _.map(passedDeck, function (ele, ind, arr) {
// 		return arr[Math.floor(Math.random() * arr.length)]
// 	})
// }

function sortIds(array) { //give list of offsets
	return array.sort(function (a, b) {
		var firstOffset = $('#' + a).offset()
		var secondOffset = $('#' + b).offset()
		return firstOffset['top'] - secondOffset['top']
	})
}

function styles(att1, att2, att3) {
	var args = _.toArray(arguments)
	switch (args.length) {
		case 1 : 
		return ' style="' + _.keys(att1) + ': ' + _.values(att1) + ';"'
		break
		case 2 : 
		return ' style="' + _.keys(att1) + ': ' + _.values(att1) + 'px; ' + _.keys(att2) + ': ' + _.values(att2) + 'px;"'
		break
		case 3 :
		return ' style="' + _.keys(att1) + ': ' + _.values(att1) + '; ' + _.keys(att2) + ': ' + _.values(att2) + 'px; ' +  _.keys(att3) + ': ' + _.values(att3) + 'px;"'
	}
}

function switchARoo(list) { // returns offset if given a jquery element else it returns a DOM element
	return _.map(list, function(ele) {
		return _.has(ele, ['left']) ? document.elementFromPoint(ele['left'], ele['top']) : $(ele).offset()
	})
}

function totalDeck() {
	var deck = _.map($('#deck>img'), function (ele) {
		return $(ele)
	})
	var hiddenDeck = _.map($('#bottomDeck>img'), function (ele) {
		return $(ele)
	})
	return deck.concat(hiddenDeck)
}

// function truthy(x) {
// 	return x!== false && existy(x)
// }

function updateData(obj, move, deferred, failcb, successcb) {
	// console.log(obj.draggedEleString)
	var draglist = (_.has(obj, 'draglist') ? obj.draglist : [obj.clicked])
	if (_.toArray(arguments).length == 1) {
		return updateElementData(obj.elementlist, obj.fullBaseValue, obj)
	} else if (_.toArray(arguments).length == 2) {
		// return _.has(move, 'row') ? revertElementData(move.matchedHovered, move.hoveredData) :
		// (revertElementData(move.draggedElements, move.draggedEleString), revertElementData(move.hoverElements, move.hoverString))
		// console.log('exactly where im supposed to be')
		return (updateElementData(move.matchedDragged, move.draggedData, obj), updateElementData(move.matchedHovered, move.hoveredData, obj))
	} else if (_.first(obj.draggedEleString).split(' ').length > arrayOfArray(draglist).length) {
		console.log(obj)
		// console.log('shouldnt be in here either')
		return deferred.reject().fail(failcb, successcb)
	} else {
		console.log(obj)
		// console.log('shouldnt be in here')
		// console.log(obj.elementlist)
		// console.log(obj.fullBaseValue)
		return (updateElementData(obj.elementlist, obj.fullBaseValue, obj), deferred.resolve().done(successcb))
	}
}

// function updateDataSet(array, object) {
// 	list = _.map(array, function (value, index) {
// 		return createObject(arrayOfArray(_.keys(value)), _.first(_.values(obj.data[index])))
// 	})
// 	return _.extend(obj, {'data' : list})
// }



function updateElementData(list, value, obj) {
	var value;
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
		return anyKey(list, ele) ? obj.data[index] = createObject(whichKey(list, ele), whichValue(value, list, ele)) : ele
	})
}

function updateIdentity(obj, value) { // use to update the identities in object when a deckcard is revealed
	return _.extend(obj, {'identity' : obj.identity.concat(value)})
}

function updateSingleOffset(object) {
	var id = $(object).attr('id')
	var offset = _.first(switchARoo([object]))
	return _.map(obj.identity, function (ele, index) {
		return convertId(ele) == id ? obj.fullOffsetList[index] = offset : ele
	})
}

function validDroppable(value) {
	return (!isNaN(value) && +value != 10) ? (+value + 1).toString() : edgeCase(value)
}

function valueByIndex(value, array, ind) {
	return _.reduce(array, function (memo, ele, index) {
		return ((index == ind) && (_.first(_.values(ele)) == value)) ? memo.concat.apply(memo, [ele, index]) : memo
	}, [])
}

// function whichKey(list, obj) { // returns the keys in list that are present in obj
// 	var initial = _.map(list, function (ele) {
// 		return _.has(obj, ele)
// 	})
// 	return _.map(initial, function (ele, index) {
// 		return ele == true ? list[index] : '' 
// 	}).join('')
// }

// function whichValue(values, list, obj) {
// 	var key = whichKey(list, obj)
// 	var array = _.reduce(list, function (memo, ele, index) {
// 		return ele == key ? [].concat.call([], memo, values[index]): memo
// 	},[])
// 	var value = anyValue([undefined], array)
// 	return _.some(value) ? undefined : array.join('')
// }

// INTERVALS and GLOBALS

var initial = {'cards' : ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], 'intervals' : [], 'list' : [], 'data' : [], 'identity' : [],
			'droppables' : [], 'fullOffsetList' : [], 'movelist' : [], 'keys' : [], 'hoverMatches' : [], 'clickedMatches' : [], 'hoveredData' : [], 'draggedData' : [],
			'draggedEleString' : []}

function bottomDeck(deferred, callback) {
	return insertDeckCard($('#bottomDeck>img'), _.range(8), {'left' : 803, 'top' : 100}, $('#bottomDeck'), deferred, callback)
}

function cardLoop(deferred, callback) {
	return dealDeck('card', 'clickable', _.range(1,9), obj, deferred, callback)
}

function dealingRow(deferred, callback) {
	return dealRow(_.range(8), deferred, callback)
}

function deckLoop(deferred, callback) {
	return dealDeck('deckCard', 'placeholder', _.range(1,41), obj, deferred, callback)
}

function fadingOut(deferred, successcb, failcb) {
	return fadeOut(_.range(8), deferred, 1250, '#bottomDeck>img', '#deck', successcb, failcb)
}

function finalLoop(deferred, callback) {
	return dealDeck('deckCard', 'placeholder', _.range(41, 97), obj, deferred, callback)
}

function reverting(deferred, callback) {
	return revertEvent(obj.draglist, obj.clicked, deferred, callback)
}

function revertingRow(deferred, callback) {
	return revertRow(_.last(obj.movelist).rowCards, '#bottomDeck>img', {'left' : 803, 'top' : 100}, deferred, callback)
}

function revertRowFadeout(deferred, successcb, failcb) {
	return fadeOut(ranger('#deck>img', 'last', 8), deferred, 500, '#deck>img', null, successcb, failcb)
}

// var curried = {
// 	set : function (arg) {
// 		return _.isEmpty(obj.pseudoHovered) ? curry(setElements, arg, [], this) : 
// 		curry(setElements, arg, _.first(switchARoo($('#' + convertId(obj.pseudoHovered)))), _.first(switchARoo($('#' + convertId(obj.pseudoDragged)))))
// 	},
// 	calculateLeft: function(arg) {
// 		if (_.isEmpty(obj.pseudoHovered))
// 			return obj
// 		return curry(calculateLeft, arg, obj, _.first(switchARoo($('#' + convertId(obj.pseudoHovered)))))
// 	},
// 	objectList : function(arg) {
// 		if (_.has(arg, 'identity'))
// 			return obj
// 		return curry(objectList, arg)
// 	},
// 	update: function(arg) {
// 		if (_.isEmpty(obj.pseudoHovered))
// 			return obj
// 		return curry(updateSingleOffset, arg, obj.clicked)
// 	},
// 	build: function(arg) {
// 		if(_.has(arg, 'identity'))
// 			return obj
// 		_.extend(obj, {'hoveredData' : [].concat.apply([], [obj.hoveredData, arg])})
// 		return curry(buildValues, [arg], [[obj.clicked]])
// 	},
// 	updateData: function(arg) {
// 		if(obj.pseudoDragged.length == 0)
// 			return obj
// 		_.extend(obj, {'hoverMatches' : [].concat.call([], obj.hoverMatches, convertId(obj.pseudoHovered)),
// 					   'clickedMatches' : [].concat.call([], obj.clickedMatches, convertId(obj.pseudoDragged))})
// 		return curry(updateData, obj)
// 	}
// }

// function updateElementData(list, value) {
// 	return _.map(obj.data, function (ele, index) {
// 		return anyKey(list, ele) ? obj.data[index] = createObject(whichKey(list, ele), value) : ele
// 	})
// }

function createEmptyObject(value) {
	var object = new Object
	var properties = _.rest(arguments)
	_.map(properties, function (ele) {
		object[ele] = value
	})
	return object
} // not used anywhere i think