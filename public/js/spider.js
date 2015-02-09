//animation.js contains : dealRow, deckCard, dragging, fadeOut, rebuildDeckCard, revertCard

//data.js contains : addMove, buildDragList, buildValues, calculateLeft, calculateOffset, dataCheck, determination,
//determineHoverElement, determinePosition, grabRowElements, fixBaseString, fixCss, fixOldData, fixZIndex, fullOffsetList,
//insertDeckCard, objectList, psuedoValues, resetDataKeys, revertElementData, revertEvent, revertRow, revertZIndex, setData, 
//setElements, setRowOffset, updateData, updateDataSet, updateElementData, updateIdentity, updateSingleOffset

//helpers.js contains: anyKey, anyValue, arrayOfArray, atts, booleanArray, buildHTML, chainer, check, checkForKeys, clearIntervals,
//convertId, convertValue, createEmptyObject, createObject, curry, existy, extractCard, extractIdentity, extractNumber, htmlGen, idList,
//intervals, keylist, mapSelectors, qualifiers, ranger, removeElements, sortIds, styles, switchARoo, truthy, valueList, valueByIndex,
//whichKey, whichValue, compareOffsets

//intializiation.js contains: buildValueList, createDeck, dealDeck, difficulty, edgeCase, generateBoard, shuffleDeck, totalDeck, validDroppable

//intervals.js contains: bottomDeck, cardLoop, dealingRow, deckLoop, fadingOut, finalLoop, reverting, revertingRow, revertRowFadeout

//keydown.js contains: determineMove, keyDownAdd, keyDownEvent, removeMove, separatedList

//functions which have no test atm : buildList, chainer,

//replaced buildImage with buildHTML

function factorization(number) {
	return _.reduce(_.range(1, number + 1), function (memo, ele) {
		return number % ele == 0 ? [].concat.call([], memo, ele) : memo
	}, [])
}

function commonFactors(numbers) {
	var factored = _.map(numbers, function (ele) {
		return factorization(ele)
	})
	var factorList = _.reduce(factored, function (memo, ele) {
		return [].concat.call([], memo, ele)
	}, [])
	var uniqueFactors = _.reduce(factorList, function (memo, ele) {
		return _.contains(memo, ele) ? memo : [].concat.call([], memo, ele)
	}, [])
	var common = _.reduce(uniqueFactors, function (memo, ele, index, array){
		var booleanArr = _.map(factored, function (elem) {
			return _.contains(elem, ele) ? true : false
		})
		return _.every(booleanArr) ? [].concat.call([], memo, ele) : memo
	})
	return Math.max.apply(null, common)
}

function naturalSort(string) {
	var array = string.split('')
	var stringArr = _.reduce(array, function (memo, ele) {
		return isNaN(+ele) ? [].concat.call([], memo, ele) : memo
	}, []).sort(function (a, b) {
		return a > b
	})
	var numberArr = _.reduce(array, function (memo, ele) {
		return isNaN(+ele) ? memo : [].concat.call([], memo, ele)
	}, []).sort(function (a, b) {
		return a - b
	})
	var recursiveNatural = function(strings, numbers, initial, fin) {
		if (_.isEmpty(initial)) {
			return fin
		} else {
			var string = _.first(strings)
			var number = _.first(numbers)
			return isNaN(+_.first(initial)) ? recursiveNatural(_.rest(strings), numbers, _.rest(initial), [].concat.call([], fin, string)) 
											: recursiveNatural(strings, _.rest(numbers), _.rest(initial), [].concat.call([], fin, number))
		}
	}
	return recursiveNatural(stringArr, numberArr, array, [])
}

function bottomDeck(deferred, callback) {
	return insertDeckCard($('#bottomDeck>img'), _.range(8), {'left' : 803, 'top' : 100}, $('#bottomDeck'), deferred, callback)
}

function dealingRow(deferred, callback) {
	return dealRow(_.range(8), deferred, callback)
}

function fadingOut(deferred, successcb, failcb) {
	return fadeOut(_.range(8), deferred, 1250, '#bottomDeck>img', '#deck', successcb, failcb)
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

$(document).ready(function() {
	var b = [null]
	console.log(b)
	var gameDeferred = new $.Deferred()
	$('#setup button').on('mousedown', function(e) {
		var game = new Spider
		var deckDeferred = new $.Deferred()
		var cardDeferred = new $.Deferred()
		var bottomdeck = new $.Deferred()
		var that = $(this)
		var deckLoop = function(deferred, callback) {
			return game.dealDeck('deckCard', 'placeholder', _.range(1,41), deferred, callback)
		}
		var cardLoop = function(deferred, callback) {
			return game.dealDeck('card', 'clickable', _.range(1,9), deferred, callback)
		}
		var finalLoop = function (deferred, callback) {
			return game.dealDeck('deckCard', 'placeholder', _.range(41, 97), deferred, callback)
		}
		game.initialCondition(that, 
			function (t) { return helper.chainer(game.difficulty(t),
				function (b) { return game.createDeck(b)},
				function (b) { return game.shuffleDeck()},
				function (b) { return game.generateBoard(_.range(5), _.range(8))},
				function (b) { return game.intervals(deckLoop, 20, deckDeferred, 
					function (c) { return game.intervals(cardLoop, 20, cardDeferred, 
						function (d) { return game.intervals(finalLoop, 20, bottomdeck, 
							function (e) { return game.setData(null, 
								function (f) { return helper.chainer(game.saveHTML(),
									function (g) { return game.setData('update', 
										function (h) { return helper.chainer(game.fullOffsetList(),
											function (i) { return game.updateGame()})})})})})})})})},
			function (t) {
				return game.loadGame(game.populateBoard)
			})
		return gameDeferred.resolve(game).promise()
	})
	$('#deck').on('mousedown', 'img', function() {
		var that = this
		gameDeferred.done(function (game) {
			if (!helper.truthy(game.game.allowEvent) || !_.isEmpty(game.game.intervals))
				$(that).draggable('disable'), console.log('mousedown event disabled')
			else 
				$(that).draggable('enable')
				return helper.chainer(game.calculateOffset(), that,  
					function (a) { return game.setData('update')},
					function (a) { return game.fullOffsetList()}, 
					function (a) { return game.extractIdentity(that)}, 
					function (a) { return game.extractCard(a)}, 
					function (a) { return game.validDroppable(a)}, 
					function (a, b) { return game.buildValueList(a, b)},
					function (a) { return game.calculateLeft()}, 
					function (a) { return game.buildDragList(a)}, 
					function (a) { return _.map(a, game.switchARoo)}, 
					function (a) { return game.defaulted(a, 'draglist')})
		})
	})
	$('#deck').on('mouseenter', 'img', function() {
		var that = this
		gameDeferred.done(function (game) {
			$(that).draggable()
			var obj = game.defaulted(false, 'allowEvent')
			if (!_.isEmpty(game.game.intervals)) 
				$(that).draggable('disable')
			else 
				return helper.chainer(game.calculateLeft(game.switchARoo(that)), 
					function (a) { return helper.compareOffsets(game.switchARoo(that), a, helper.lastIndex, game.separatedList)},
					function (a) { return _.isBoolean(a) ? a : helper.booleanArray(_.last(a), game.switchARoo(that))},
					function (a) { return a == false ? $(that).draggable('disable') : $(that).draggable('enable')},
					function (a) { return game.defaulted(true, 'allowEvent')})
		})
	})
	$('#deck').on('drag', 'img', function() {
		var that = this
		var reverting = function(deferred, callback) {
			return revertEvent(obj.draglist, obj.clicked, deferred, callback)
		}
		gameDeferred.done(function (game) {
			if (!helper.truthy(game.game.allowEvent) || _.isEmpty(game.game.data)) 
				$(that).draggable('disable')
			else 
				$(that).draggable('enable')
			var deferred = new $.Deferred();
			var revertingDeferred = new $.Deferred();
			var deckCardDeferred = new $.Deferred();
			var specialCase = new $.Deferred();
			return helper.chainer(game, that, 
				function (a, b) { return game.determineHoverElement(b)}, 
				function (a, b) { return game.setElements(a, b)},
				function (a) { return game.dragging(
					function (c) { 
						console.log('started reverting')
						console.log(c)
					}, 
					function (d) {
						console.log('didnt revert')
					})})

		})
	})
})

// 	$(document).on('mousedown', function(e) {
// 		// console.log(e.pageX + ' , ' + e.pageY)
// 	})

// 	$('#deck').on('drag', 'img', function() {
// 		if(!truthy(obj.allowEvent) || _.isEmpty(obj.data)) {
// 			$(this).draggable('disable')
// 		} else {
// 			$(this).draggable('enable')
// 			var ele = $(this)
// 			var deferred = new $.Deferred()
// 			var revertingDeferred = new $.Deferred()
// 			var deckCardDeferred = new $.Deferred()
// 			var specialCase = new $.Deferred()
// 			return chainer(ele, 
// 				function(x) { return $(ele).offset() },
// 			    function(x) { return determineHoverElement(x, obj) },
// 			    function(x) { return setElements(x, ele.offset())},
// 			    function(x) { return dragging(obj, 
// 			   		 function() { console.log('starting reverting')
// 			   			return intervals(reverting, 1, deferred, function() {
// 			   				console.log('finished reverting')
// 			   				revertingDeferred.resolve().done(function() {
// 			   					return revertZIndex()
// 			   				})
// 			   			})
// 			   		}, 
// 			   		function () { return chainer(obj, 
// 			   			function(t) { return fixCss(t)},
// 			   			function(t) { return fixZIndex(t)},
// 			   			function(t) { return determinePosition(obj)},
// 			   			function(t) { return deckCard(obj, t, deckCardDeferred, 
// 			   				function() { return chainer(obj, 
// 			   					function(z) { return setData(z, 'update')},
// 			   					function(z) { return resetDataKeys()},
// 			   					function(z) { return switchARoo(arrayOfArray(obj.draglist))},
// 			   					function(z) { return calculateLeft(_.first(z))},
// 			   					function(z) { return objectList(z)},
// 			   					function(z) { return buildValues(obj.draglist, z)},
// 			   					function(z) { return updateData(obj, obj.movelist, specialCase,
// 			   						function() { console.log('fail callback')
// 			   							return chainer(calculateLeft(), 
// 			   								function(b) { return objectList(b)},
// 			   								function(b) { return fixOldData(b)},
// 			   								function(b) { return fixBaseString(obj, obj.draglist)},
// 			   								function(b) { return calculateLeft(_.first(switchARoo(obj.draglist)))},
// 			   								function(b) { return objectList(b)},
// 			   								function(b) { return buildValues(obj.draglist, b)},
// 			   								function(b) { return updateData(obj)},
// 			   								function(b) { return fullOffsetList()},
// 			   								function(b) { 
// 			   									// console.log(JSON.stringify(obj.data)), console.log(obj.movelist)
// 			   								})
// 			   						},
// 			   						function() { console.log('success callback')
// 			   							return chainer(addMove(),
// 			   								function(a) { return _.extend(obj, {'initialOffset' : {}})},
// 			   								function(a) { console.log(_.isEmpty(obj.initialOffset))},
// 			   								function(a) { return fullOffsetList()},
// 			   								function(a) { return updateGame(a)
// 			   									// console.log(JSON.stringify(obj.data)), console.log(obj.movelist)
// 			   								})	
// 			   						})	   							
// 			   					})
// 			   				})
// 			   			})
// 			   		})
// 			   })
// 		}
// 	})

// 	$('#deck').on('mouseleave', 'img', function() {
// 		$(this).removeClass('ui-draggable ui-draggable-handle')
// 		$(this).removeClass('ui-draggable-disabled')
// 		console.log('getting into mouseleave event')
// 		_.extend(obj, {'allowEvent' : false})
// 	})
// 	$(this).on('keydown', window, function(event) {
// 		if (!_.isEmpty(obj.intervals)) {
// 			$(this).off('keydown', window)
// 		} else {
// 			// console.log('intervals is ' + obj.intervals)
// 			var keydownDeferred = new $.Deferred()
// 			var revertRowDeferred = new $.Deferred()
// 			var fadeoutDeferred = new $.Deferred()
// 			var bottomdeckDeferred = new $.Deferred()
// 			return chainer(event.which, 
// 				function(t) { return keyDownAdd(t)},
// 				function(t) { return checkForKeys([17, 90], obj.keys)},
// 				function(t) { return t == true ? keyDownEvent(obj.movelist, keydownDeferred, 
// 					function (move) {
// 						// console.log('no deck card, success callback')
// 					},
// 					function (move) { 
// 						// console.log('deck card/row found')
// 						return determineMove(move, 
// 							function (arg) {
// 								// console.log('last move was a row')
// 								return intervals(revertingRow, 20, revertRowDeferred, 
// 									function() {
// 										// console.log('done reverting row')
// 										return intervals(revertRowFadeout, 5, fadeoutDeferred, null, 
// 											function() {
// 												// console.log('done fading out')
// 												return intervals(bottomDeck, 1, bottomdeckDeferred, 
// 													function() { 
// 														// console.log('finished fixing deck')
// 														return chainer(updateData(obj, arg), 
// 															function(b) { return removeElements(ranger($('#deck>img'), 'last', 8), $('#deck>img'))},
// 															function(b) { return setData(obj, 'update')},
// 															function(b) { return fullOffsetList()},
// 															function(b) { return updateDataSet(b.identity, b)},
// 															function(b) { return removeMove(obj.movelist)})
// 													})
// 											})
// 									})
// 							},
// 							function (arg) {console.log('last move had a deckCard')
// 								return rebuildDeckCard(arg, 
// 									function (move) {
// 										return revertCard(move.draggedElements, move.draggedEleOffsets, 
// 											function () {
// 												return chainer(setData(obj, 'update'),
// 													function(m) { return fullOffsetList()},
// 													function(m) { return updateDataSet(m.identity, m)},
// 													function(m) { return updateData(obj, move)},
// 													function(m) { return removeMove(obj.movelist)})
// 											})
// 									})
// 							})
// 					}) 
// 			: obj})
// 		}
// 	})
// 	$(this).on('keyup', function() {
// 		return _.extend(obj, {'keys' : []})
// 	})
// 	$('#bottomDeck').on('mousedown', 'img', function() {
// 		// console.log('default speed is ' + $.fx.speeds._default)
// 		if (_.isEmpty(obj.data) || !_.isEmpty(obj.intervals)) {
// 			console.log('disabled')
// 			console.log(obj.data)
// 			console.log(obj.intervals)
// 			$(this).off('mousedown', 'img')
// 		} else {
// 			var removeElementsDeferred = new $.Deferred()
// 			var fadeOutDeferred = new $.Deferred()
// 				return chainer(obj, 
// 					function(t) { return check(obj.fullOffsetList, setData, obj, 'update', 
// 						function() { return chainer(obj, 
// 							function(b) { return calculateOffset(b)},
// 							function(b) { return fullOffsetList()},
// 							function(b) { return intervals(dealingRow, 150, removeElementsDeferred, 
// 								function() { return intervals(fadingOut, 150, fadeOutDeferred, null,
// 									function() { return chainer(obj, 
// 										function(c) { return removeElements(_.range(8), $('#bottomdeck>img'))},
// 										function(c) { return setData(obj, 'update', 
// 											function() { return chainer(obj.identity, 
// 												function(d) { return updateDataSet(d, obj)},
// 												function(d) { return grabRowElements(_.range(1, 9))},
// 												function(d) { _.extend(obj, {'currentRow' : d})
// 															  return d},
// 												function(d) { return arrayOfArray(qualifiers(d, extractIdentity, extractCard, validDroppable, buildValueList, 
// 		 				 					  						 pseudoValues, curried.set, curried.calculateLeft, curried.objectList, curried.build, 
// 						 					  						 curried.updateData, curried.update))},
// 												function(d) { return fullOffsetList()},
// 												function(d) { return idList(obj.currentRow)},
// 												function(d) { return addMove(d)})
// 											}
// 										)})

// 									})

// 								})
// 							})

// 						})
// 				})
// 		}
// 	})
// })