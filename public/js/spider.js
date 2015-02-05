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

function updateGame(object) {
	var id = $('.gameboard').attr('id')
	return $.ajax({
		contentType : 'application/json' ,
		type : 'post',
		url : '/update/' + id,
		data : JSON.stringify({game : object}),
		success : function(data) {
			console.log('line break')
			console.log(data)
		}
	}).then(function() {
		alert('done updating')
	})
}

function loadGame() {
	var id = $('.gameboard').attr('id')
	return $.ajax({
		dataType : 'json',
		type : 'post',
		url : '/loadgame/' + id,
		success : function(data) {
			console.log(data)
		}
	})
}

function initialCondition(element, newgame, loadgame) {
	return $(element).attr('id') == 'new-game' ? ($('#initial>button').css('display', 'none'), $('#difficulty>button').css('display', 'inline'), $('#cheating>button').css('display', 'none')) : 
	$(element).attr('id') == 'load-game' ? ($('#initial>button').css('display', 'inline'),  $('#difficulty>button').css('display', 'none'), $('#cheating>button').css('display', 'inline'), loadgame()) : 
	($('#initial>button').css('display', 'inline'),  $('#difficulty>button').css('display', 'none'), $('#cheating>button').css('display', 'inline'), newgame($(element).attr('id')))
}

	// console.log(obj)
	// console.log(curried)
	// console.log(bleh(game))
		// function bleh(func) {
	// 	for (prop in func)
	// 		if (_.has(func, prop))
	// 			console.log('function has ' + prop)
	// }

$(document).ready(function () {
	var game = new Spider(initial)
	// console.log(game)
	// console.log(game.prototype)
	// console.log(game.addMove)
	obj = game.obj
	curried = game.curried

	$(document).on('mousedown', function(e) {
		// console.log(e.pageX + ' , ' + e.pageY)
	})
	$('#setup button').on('mousedown', function() {
		var deckDeferred = new $.Deferred()
		var cardDeferred = new $.Deferred()
		var bottomdeck = new $.Deferred()
		var that = this
		console.log(obj.data.length)
		initialCondition(that, 
			function(t) { return chainer(t,
				function(t) { return difficulty(t)},
				function(t) { return createDeck(obj, t)},
				function(t) { return shuffleDeck(t)},
				function(t) { return _.extend(obj, {'shuffledDeck' : t, 'ImageDimensions' : {'height' : 96, 'width' : 71}})},
				function(t) { return generateBoard(t, _.range(5), _.range(8))},
				function(t) { return intervals(obj, deckLoop, 20, deckDeferred, 
					function() { return intervals(obj, cardLoop, 20, cardDeferred, 
						function() { return intervals(obj, finalLoop, 20, bottomdeck, 
					  		function() { return setData(obj, null, 
					  			function(c) { return updateGame(obj) })})
						})					  	
					})
				})}, loadGame)
	})
	// $('#load-game').on('mousedown', function() {
	// 	var that = $(this)
	// 	return chainer(initialCondition(that), 
	// 		function(a) { return loadGame()})
	// })
		
	// $('#easy').on('click', function () {
	// 	var deckDeferred = new $.Deferred()
	// 	var cardDeferred = new $.Deferred()
	// 	var bottomdeck = new $.Deferred()
	// 	return chainer('easy', 
	// 		function(t) { return difficulty(t)},
	// 		function(t) { return createDeck(obj, t)},
	// 		function(t) { return shuffleDeck(t)},
	// 		function(t) { return _.extend(obj, {'shuffledDeck' : t, 'ImageDimensions' : {'height' : 96, 'width' : 71}})},
	// 		function(t) { return generateBoard(t, _.range(5), _.range(8))},
	// 		function(t) { return intervals(deckLoop, 20, deckDeferred, 
	// 			function() { return intervals(cardLoop, 20, cardDeferred, 
	// 				function() { return intervals(finalLoop, 20, bottomdeck, 
	// 				  	function() { return setData(obj)})
	// 				})					  	
	// 			})
	// 		})
	// })
	$('#deck').on('mousedown', 'img', function() {
		if (_.isEmpty(obj.data) || !truthy(obj.allowEvent) || !_.isEmpty(obj.intervals)) {
			console.log('mousedown event disabled')
			$(this).draggable('disable'), $(this).off('mousedown', 'img')
		} else { 
			$(this).draggable('enable')
			var ele = $(this)
			return chainer(obj, 
				function(t) { return calculateOffset(t)},
				function(t) { return setData(obj, 'update')},
				function(t) { return fullOffsetList()},
				function(t) { return extractIdentity(ele)},
				function(t) { return extractCard(t)},
				function(t) { return validDroppable(t)},
				function(t) { return buildValueList(t)},
				function(t) { return _.extend(obj, {'droppables' : t, 'initialOffset' : $(ele).offset()})},
				function(t) { return calculateLeft()},
				function(t) { return buildDragList(t)},
				function(t) { return switchARoo(t)},
				function(t) { return _.extend(obj, {'draglist' : [t]})})
		}
	})
	$('#deck').on('drag', 'img', function() {
		if(!truthy(obj.allowEvent) || _.isEmpty(obj.data)) {
			$(this).draggable('disable')
		} else {
			$(this).draggable('enable')
			var ele = $(this)
			var deferred = new $.Deferred()
			var revertingDeferred = new $.Deferred()
			var deckCardDeferred = new $.Deferred()
			var specialCase = new $.Deferred()
			return chainer(ele, 
				function(x) { return $(ele).offset() },
			    function(x) { return determineHoverElement(x, obj) },
			    function(x) { return setElements(x, ele.offset())},
			    function(x) { return dragging(obj, 
			   		 function() { console.log('starting reverting')
			   			return intervals(reverting, 1, deferred, function() {
			   				console.log('finished reverting')
			   				revertingDeferred.resolve().done(function() {
			   					return revertZIndex()
			   				})
			   			})
			   		}, 
			   		function () { return chainer(obj, 
			   			function(t) { return fixCss(t)},
			   			function(t) { return fixZIndex(t)},
			   			function(t) { return determinePosition(obj)},
			   			function(t) { return deckCard(obj, t, deckCardDeferred, 
			   				function() { return chainer(obj, 
			   					function(z) { return setData(z, 'update')},
			   					function(z) { return resetDataKeys()},
			   					function(z) { return switchARoo(arrayOfArray(obj.draglist))},
			   					function(z) { return calculateLeft(_.first(z))},
			   					function(z) { return objectList(z)},
			   					function(z) { return buildValues(obj.draglist, z)},
			   					function(z) { return updateData(obj, obj.movelist, specialCase,
			   						function() { console.log('fail callback')
			   							return chainer(calculateLeft(), 
			   								function(b) { return objectList(b)},
			   								function(b) { return fixOldData(b)},
			   								function(b) { return fixBaseString(obj, obj.draglist)},
			   								function(b) { return calculateLeft(_.first(switchARoo(obj.draglist)))},
			   								function(b) { return objectList(b)},
			   								function(b) { return buildValues(obj.draglist, b)},
			   								function(b) { return updateData(obj)},
			   								function(b) { return fullOffsetList()},
			   								function(b) { 
			   									// console.log(JSON.stringify(obj.data)), console.log(obj.movelist)
			   								})
			   						},
			   						function() { console.log('success callback')
			   							return chainer(addMove(),
			   								function(a) { return _.extend(obj, {'initialOffset' : {}})},
			   								function(a) { console.log(_.isEmpty(obj.initialOffset))},
			   								function(a) { return fullOffsetList()},
			   								function(a) { return updateGame(a)
			   									// console.log(JSON.stringify(obj.data)), console.log(obj.movelist)
			   								})	
			   						})	   							
			   					})
			   				})
			   			})
			   		})
			   })
		}
	})

	$('#deck').on('mouseenter', 'img', function() {
		$(this).draggable()
		_.extend(obj, {'allowEvent' : false}) 
		if (_.isEmpty(obj.data) || !_.isEmpty(obj.intervals) ) {
			$(this).draggable('disable'), $(this).off('mouseenter', 'img')
		} else {
			var that = $(this)
			return check(obj.fullOffsetList, 
				function (arg) { console.log('offset list is empty')
				$(that).draggable('disable')
					return chainer(setData(arg, 'update'), 
						function(b) { return fullOffsetList()})
				}, 
				function (arg) { console.log('offset list is not empty')
					return chainer(calculateLeft(_.first(switchARoo(that))), 
						function(z) { return compareOffsets(_.first(switchARoo(that)), z, lastIndex, separatedList)},
						function(z) { return _.isBoolean(z) ? z : booleanArray(_.last(z), _.first(switchARoo([that])))},
						function(z) { return z == false ? $(that).draggable('disable') : $(that).draggable('enable')},
						function(z) { return _.extend(obj, {'allowEvent' : true})})
				})
			// return check(obj.fullOffsetList, setData, obj, 'update', 
			// 	function() { return chainer(obj, 
			// 		function(t) { return calculateOffset(t)},
			// 		// function(t) { return fullOffsetList(obj)},
			// 		function(t) { return calculateLeft(t, _.first(switchARoo(that)))},
			// 		function(t) { console.log(t)
			// 			return compareOffsets(_.first(switchARoo(that)), _.last(t), separatedList)},
			// 		function(t) { return _.isBoolean(t) ? t : booleanArray(_.last(t), _.first(switchARoo([that])))},
			// 		function(t) { return t == false ? $(that).draggable('disable') : $(that).draggable('enable')},
			// 		function(t) { return _.extend(obj, {'allowEvent' : true})},
			// 		function(t) { 
			// 			// console.log(obj.data), console.log(obj.movelist)
			// 		})
			// })		
		}
	})
	$('#deck').on('mouseleave', 'img', function() {
		$(this).removeClass('ui-draggable ui-draggable-handle')
		$(this).removeClass('ui-draggable-disabled')
		console.log('getting into mouseleave event')
		_.extend(obj, {'allowEvent' : false})
	})
	$(this).on('keydown', window, function(event) {
		if (!_.isEmpty(obj.intervals)) {
			$(this).off('keydown', window)
		} else {
			// console.log('intervals is ' + obj.intervals)
			var keydownDeferred = new $.Deferred()
			var revertRowDeferred = new $.Deferred()
			var fadeoutDeferred = new $.Deferred()
			var bottomdeckDeferred = new $.Deferred()
			return chainer(event.which, 
				function(t) { return keyDownAdd(t)},
				function(t) { return checkForKeys([17, 90], obj.keys)},
				function(t) { return t == true ? keyDownEvent(obj.movelist, keydownDeferred, 
					function (move) {
						// console.log('no deck card, success callback')
					},
					function (move) { 
						// console.log('deck card/row found')
						return determineMove(move, 
							function (arg) {
								// console.log('last move was a row')
								return intervals(revertingRow, 20, revertRowDeferred, 
									function() {
										// console.log('done reverting row')
										return intervals(revertRowFadeout, 5, fadeoutDeferred, null, 
											function() {
												// console.log('done fading out')
												return intervals(bottomDeck, 1, bottomdeckDeferred, 
													function() { 
														// console.log('finished fixing deck')
														return chainer(updateData(obj, arg), 
															function(b) { return removeElements(ranger($('#deck>img'), 'last', 8), $('#deck>img'))},
															function(b) { return setData(obj, 'update')},
															function(b) { return fullOffsetList()},
															function(b) { return updateDataSet(b.identity, b)},
															function(b) { return removeMove(obj.movelist)})
													})
											})
									})
							},
							function (arg) {console.log('last move had a deckCard')
								return rebuildDeckCard(arg, 
									function (move) {
										return revertCard(move.draggedElements, move.draggedEleOffsets, 
											function () {
												return chainer(setData(obj, 'update'),
													function(m) { return fullOffsetList()},
													function(m) { return updateDataSet(m.identity, m)},
													function(m) { return updateData(obj, move)},
													function(m) { return removeMove(obj.movelist)})
											})
									})
							})
					}) 
			: obj})
		}
	})
	$(this).on('keyup', function() {
		return _.extend(obj, {'keys' : []})
	})
	$('#bottomDeck').on('mousedown', 'img', function() {
		// console.log('default speed is ' + $.fx.speeds._default)
		if (_.isEmpty(obj.data) || !_.isEmpty(obj.intervals)) {
			console.log('disabled')
			console.log(obj.data)
			console.log(obj.intervals)
			$(this).off('mousedown', 'img')
		} else {
			var removeElementsDeferred = new $.Deferred()
			var fadeOutDeferred = new $.Deferred()
				return chainer(obj, 
					function(t) { return check(obj.fullOffsetList, setData, obj, 'update', 
						function() { return chainer(obj, 
							function(b) { return calculateOffset(b)},
							function(b) { return fullOffsetList()},
							function(b) { return intervals(dealingRow, 150, removeElementsDeferred, 
								function() { return intervals(fadingOut, 150, fadeOutDeferred, null,
									function() { return chainer(obj, 
										function(c) { return removeElements(_.range(8), $('#bottomdeck>img'))},
										function(c) { return setData(obj, 'update', 
											function() { return chainer(obj.identity, 
												function(d) { return updateDataSet(d, obj)},
												function(d) { return grabRowElements(_.range(1, 9))},
												function(d) { _.extend(obj, {'currentRow' : d})
															  return d},
												function(d) { return arrayOfArray(qualifiers(d, extractIdentity, extractCard, validDroppable, buildValueList, 
		 				 					  						 pseudoValues, curried.set, curried.calculateLeft, curried.objectList, curried.build, 
						 					  						 curried.updateData, curried.update))},
												function(d) { return fullOffsetList()},
												function(d) { return idList(obj.currentRow)},
												function(d) { return addMove(d)})
											}
										)})

									})

								})
							})

						})
				})
		}
	})
})