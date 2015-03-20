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

var containsSubString = function(str, substr) {
		var str = str.split('')
		var substring = substr.split('')
		var findings = _.reduce(str, function (memo, ele, index, array) {
			var temp = _.reduce(substring, function (memom, elem, ind) {
				return array[index + ind] == elem ? [].concat.call([], memom, elem) : memom
			}, []).join('')
			return temp == substr ? 'true' : memo
		}, [])
		return _.isEmpty(findings) ? false : true
}

var reducedString = function(initial, substr, finalStr) {
	if (_.isEmpty(initial)) 
		return finalStr
	else 
		var substr = _.isArray(substr) ? substr : substr.split('')
		var initial = _.isArray(initial) ? initial : initial.split('')
		var truthy = _.map(initial, function (ele, index) {
			return ele == _.first(substr) ? true : false
		})
		var index = _.reduce(truthy, function (memo, ele, index) {
			return ele == true && _.isEmpty(memo) ? memo += index : memo
		}, '')
		var returnedString = _.some(truthy) ? [].concat.call([], finalStr, _.first(substr)) : [].concat.call([], finalStr)
		var updatedInitial = _.some(truthy) ? [].concat.call([], _.rest(initial, index)) : []
		return reducedString(updatedInitial, _.rest(substr), returnedString)
}

$(document).ready(function() {
	$('.dealer').on('mousedown', function(event) {
		// console.log(event.clientX), console.log(event.clientY)
		gameDeferred.done( function (game) {
			console.log(game.game.intervals)
		})
	})
	var gameDeferred = new $.Deferred()
	$('#setup button').on('mousedown', function(e) {
		var game = new Spider
		var deckDeferred = new $.Deferred()
		var cardDeferred = new $.Deferred()
		var bottomdeck = new $.Deferred()
		var that = $(this)
		return game.initialCondition(that, 
			function (t) { return helper.chainer(game, t, 
				function (b) { return game.difficulty(t)},
				function (b) { return game.createDeck(b)},
				function (b) { return game.shuffleDeck()},
				function (b) { return game.generateBoard(_.range(5), _.range(8))},
				function (b) { return game.dealDeck(8, 'deckCard', '#deck', _.range(1, 49), 20, deckDeferred, 
					function (c) { return helper.chainer(game, that, 
						function (d) { return game.setData('update')},
						function (d) { return game.fullOffsetList()}, 
						function (d) { return game.calculateOffset()},
						function (d) { return _.map(d, function (ele) { return {'top' : +ele['top'] + 20, 'left' : ele['left']}})}, 
						function (d) { return game.dealCards(null, _.range(1, 9), d, 'card', 20, null, cardDeferred, null, 
							function (e) { return helper.chainer(game, that, 
								function (f) { return _.map(_.range(41, 97), function (ele) { return {'left' : -140, 'top' : -100}})},
								function (f) { return game.dealCards(null, _.range(41, 97), f, 'deckCard', 20, null, bottomdeck, null, 
									function (g) { return helper.chainer(game, that, 
										function (h) { return game.saveHTML()},
										function (h) { return game.setData(null)},
										function (h) { return game.setData('update')},
										function (h) { return game.calculateOffset()},
										function (h) { return game.updateGame()}
									)}
								)}
							)}
						)}
					)}
				)}
			)},
			function (t) {
				return game.loadGame(
					function (data) {
						console.log(data)
						return helper.chainer(game, that, $('div>.error').html(''), 
							function (a) { return game.populateBoard(data)},
							function (a) { return game.fullOffsetList()},
							function (a) { return game.resetStackHTML()}
						)}, 
					function (data) {
						$('div>.error').html(data.error)
					})
			},
			function (t) {
				return gameDeferred.resolve(game).promise()
			})
	})
	$('#save').on('mousedown', function() {
		gameDeferred.done(function (game) {
			return game.offsetCheck(
				function () { },
				function () { return (game.saveHTML(), game.updateGame())})
		})
	})
	$('#cheat').on('mousedown', function () {
		gameDeferred.done(function (game) {
			var bleh = new $.Deferred()
			game.cheat("#deck>img[id*='deck']", 350)
		})
	})
	// $('.dealer').on('mousedown', function() {
	// 			console.log(JSON.stringify($(this).offset()))
	// 	console.log(JSON.stringify($(this).position()))
	// })
	$('#deck').on('mousedown', 'img', function() {
		var that = this
		console.log($(this).offset())
		gameDeferred.done(function (game) {
			if (!helper.truthy(game.game.allowEvent) || !_.isEmpty(game.game.intervals))
				$(that).draggable('disable'), console.log('mousedown event disabled')
			else 
				$(that).draggable('enable')
				return helper.chainer(game, game.calculateOffset(), that,  
					function (a) { return game.setData('update')},
					function (a) { return game.fullOffsetList()}, 
					function (a) { return game.extractIdentity(that)}, 
					function (a) { return game.extractCard(a)}, 
					function (a) { return game.validDroppable(a)}, 
					function (a, b) {return game.buildValueList(a, b)},
					function (a) { return game.calculateLeft()}, 
					function (a) { return game.buildDragList(a)},
					function (a) { return _.map(a, game.switchARoo)}, 
					function (a) { return game.defaulted(a, 'draglist')},
					function (a) { return game.disableDragging('#deck>img')})
		})
	})
	$('#deck').on('mouseenter', 'img', function() {
		var that = this
		gameDeferred.done(function (game) {
			$(that).draggable()
	// 		var obj = game.defaulted(false, 'allowEvent')
	// 		if (!_.isEmpty(game.game.intervals)) 
	// 			$(that).draggable('disable')
	// 		else 
	// 			return helper.chainer(game, game.calculateLeft(game.switchARoo(that)), 
	// 				function (a) { return helper.compareOffsets(game.switchARoo(that), a, helper.lastIndex, game.separatedList)},
	// 				function (a) { return _.isBoolean(a) ? a : helper.booleanArray(_.last(a), game.switchARoo(that))},
	// 				function (a) { return a == false || $(that).attr('id') == 'any' ? $(that).draggable('disable') : $(that).draggable('enable')},
	// 				function (a) { return game.defaulted(true, 'allowEvent')})
		})
	})
	$('#deck').on('mouseleave', 'img', function() {
		var that = this
		gameDeferred.done(function (game) {
			return $(that).hasClass('ui-draggable', 'ui-draggable-handle') ? $(that).removeClass('ui-draggable', 'ui-draggable-handle') :
					$(that).hasClass('ui-draggable') ? $(that).removeClass('ui-draggable') :
					$(that).hasClass('ui-draggable-handle') ? $(that).removeClass('ui-draggable-handle') : 
					$(that).attr('id') == 'any' ? $(that).draggable('disable') : $(that)
		})
	})
	$('#deck').on('drag', 'img', function() {
		var that = this
		gameDeferred.done(function (game) {
			var reverting = function(deferred, callback) {
				return game.unacceptableDraggable(that, deferred, callback)
			}
			var moveStack = function(deferred, successcb, failcb, args) {
				var list = game.completedSuit().reverse()
				var selector = game.stackLocation()
				return game.moveCard(selector, list, deferred, successcb, args)
			}
			var addDeckCard = function(deferred, successcb, failcb, args) {
				var selector = game.stackLocation()
				console.log($(selector).offset())
				return game.insertDeckCard(true, selector, _.range(1), null, null, deferred, successcb, args)
			}
			if (!helper.truthy(game.game.allowEvent) || _.isEmpty(game.game.data)) {
				console.log('disabled') 
				$(that).draggable('disable')
			} else 
				$(that).draggable('enable')
				var deferred = new $.Deferred();
				var deckCardDeferred = new $.Deferred();
				var specialCase = new $.Deferred();
				var stackDeferred = new $.Deferred();
				var completedStackDeferred = new $.Deferred();
				return helper.chainer(game, that, 
					function (a) { return game.determineHoverElement(a)}, 
					function (a, b) { return game.setElements(a, that)},
					function (a, b) { return game.dragging(
						function (c) { return game.intervals(reverting, 1, deferred,
							function () { return game.revertZIndex('draglist')}
							)}, 
						function (c) { return helper.chainer(game, c, that, 
							function (d) { return game.fixCss()},
							function (d) { return game.fixZIndex(d)},
							function (d) { return game.determinePosition()},
							function (d) { return game.deckCard(d, deckCardDeferred, 
								function (e) { return helper.chainer(game, e, that, 
									function (f) { return game.setData('update', 
										function (g) { return helper.chainer(game, game.updateDataKeys(), 
											function (h) { return game.calculateLeft(game.switchARoo(that))},
											function (h) { return game.objectList(h)},
											function (h) { return game.buildValues(h)},
											function (h) { return game.updateData(specialCase, null, 
												function (g) { return helper.chainer(game, game.calculateLeft(), that, 
													function (i) { return game.objectList(i)},
													function (i) { return game.fixOldData(i)}, 
													function (i) { return game.fixBaseString()}, 
													function (i) { return game.calculateLeft(game.switchARoo(that))},
													function (i) { return game.objectList(i)},
													function (i) { return game.buildValues(i, true)},
													function (i) { return game.updateData('fixed')})
												},
												function (g) { return helper.chainer(game, game.addMove(), that, 
													function (i) { return game.defaulted([], "allowEvent", "cardStackHTML", 'clicked', "clickedMatches", "currentRow", "deckHTML", "draggedData", "draggedEleOffsets", "draggedEleString", 
																   "draggedElements", "draglist", "droppables", "elementlist", "fullBaseValue", "hoverElements", "hoverMatches", "hoverString", "hovered", "hoveredData", "initialOffset", 
																   "intervals", "keys", "list", "offsets", "oldHoverCard", "previousRow", "ImageDimensions", "pseudoDragged", "pseudoHovered")},
													function (i) { return game.fullOffsetList()},
													function (i) { return game.completedSuit()},
													function (i) { return !_.isEmpty(i) ? helper.chainer(game, that, i,
														function (j, jj) { console.log($('#stack1>img').length)
															return game.addCompletedStack(jj)},
														function (j, jj) { return game.intervals(moveStack, 250, stackDeferred, 
															function (k) { return game.intervals(addDeckCard, 250, completedStackDeferred, 
																function (l) { console.log($('#stack1>img').length)}, null, k)}
														, null, jj)}
													) : helper.chainer(game, that,
														function (j) { 
															// console.log(_.last(game.game.movelist))
														})
													},
													function (i) { 
														console.log(game.game.movelist), console.log(JSON.stringify(game.game.data))
													})
												})
											})
										})
									})
								})
							})
						})
					})
		})
	})

	$('#bottomDeck').on('mousedown', 'img', function() {
		var that = this
		gameDeferred.done(function (game) {
			var dealingRow = function(deferred, callback) {
				return game.dealRow(_.range(8), deferred, callback)
			}
			var fadingOut = function(deferred, successcb, failcb, args) {
				return game.fadeOut(_.range(8), deferred, 1250, '#bottomDeck>img', '#deck', args, successcb, failcb)
			}
			var removeElementsDeferred = new $.Deferred()
			var fadeOutDeferred = new $.Deferred()
			var dealingRowDeferred = new $.Deferred()

			if (_.isEmpty(game.game.data) || !_.isEmpty(game.game.intervals))
				$(that).off('mousedown', 'img')
			else
				return helper.chainer(game, that, 
					function (a) { return game.offsetCheck(
						function (b) { console.log('fullOffsetList is empty')},
						function (b) { return helper.chainer(game, that, game.calculateOffset(),
							function (c) { return game.selectElements('#bottomDeck>img', 8, 'first')},
							function (eles, sorted) { return helper.chainer(game, that, eles, sorted,
								function (e, f, g) { return _.map(g, function (ele) { return {'left' : ele['left'], 'top' : +ele['top'] + 20}})},
								function (e, f, g) { return game.dealCards(true, f, e, null, 100, null, dealingRowDeferred, [g],
									function (h) { return game.intervals(fadingOut, 150, fadeOutDeferred, [h], null, 
										function (i) { return helper.chainer(game, that, game.removeElements(_.range(8), '#bottomDeck>img'), i,
											function (j) { return game.setData('update')},
											function (j) { return game.updateDataKeys()},
											function (j, k, l) { return _.map(l, game.switchARoo)},
											function (j) { return game.defaulted(j, 'previousRow')},
											function (j) { return game.calculateOffset()},
											function (j) { return _.map(j, game.switchARoo)},
											function (j) { return game.defaulted(j, 'currentRow'), j},
											function (j) { return helper.qualifiers(game, j, game.extractIdentity, game.extractCard, game.validDroppable, game.buildValueList,
															game.pseudoValues)},
											function (j) { console.log(j)})
									})
								})
							})
						})
					})
				})
		})

	})
	$(this).on('keydown', window, function (event) {
		var that = this
		gameDeferred.done(function (game) {
			var revertingRow = function(deferred, callback) {
				return game.revertRow('#bottomDeck>img', {'left' : 803, 'top' : 100}, deferred, callback)
			}
			var revertRowFadeout = function(deferred, successcb, failcb) {
				return game.fadeOut(game.ranger('#deck>img', 'last', 8), deferred, 500, '#deck>img', null, successcb, failcb)
			}
			var bottomDeck = function(deferred, callback) {
				return game.insertDeckCard(null, $('#bottomDeck>img'), _.range(8), {'left' : 803, 'top' : 100}, $('#bottomDeck'), deferred, callback)
			}
			var undo = function (deferred, callback) {
				return game.undoMove(deferred, callback)
			}
			if (!_.isEmpty(game.game.intervals))
				$(this).off('keydown', window)
			else
				var keydownDeferred = new $.Deferred()
				var revertRowDeferred = new $.Deferred()
				var fadeOutDeferred = new $.Deferred()
				var bottomdeckDeferred = new $.Deferred()
				return helper.chainer(game, event.which, 
					function (a) { return game.keyDownAdd(a)},
					function (a) { return game.checkForKeys([90, 17])},
					function (a) { return a == true ? game.keyDownEvent('row', keydownDeferred, 
						function (b) { console.log(b)
							return game.determineMove('oldHoverCard', b, 
							function (c) { return helper.chainer(game, that, c, 
								function (d, dd) { return game.determineMove('completedStack', dd, 
									function (e) { game.revertStack(e, function () { console.log(game.game.movelist)})} 
									, null)},
								function (d, dd) { return game.determineMove('oldHoverCard.deckcard', dd.oldHoverCard, 
									function () { console.log('do i get here?')
										return game.rebuildDeckCard()}
									, null)}
							)},
							function (c) { return window.setTimeout(
								function () {game.undoMove(
									function (d) { game.setData('update',
										function (e) { return helper.chainer(game, that,
											function (f) { return game.fullOffsetList()},
											function (f) { return game.updateDataKeys()},
											function (f) { return game.updateData(null, 'update game data')},
											function (f) { return game.removeMove()},
											function (f) { console.log(game.game.movelist), console.log(JSON.stringify(game.game.data))}
										)}
									)}
								)}
							, 500)}
						)}
						,
						function (c) { console.log('row found')
							return game.intervals(revertingRow, 20, revertRowDeferred, 
							function (d) { return game.intervals(revertRowFadeout, 5, fadeOutDeferred, null, 
								function (e) { return game.intervals(bottomDeck, 1, bottomdeckDeferred, 
									function (f) { return helper.chainer(game, that,
										function (g) { return game.updateData(null, 'update game data')}, 
										function (g) { return game.removeElements(game.ranger('#deck>img', 'last', 8), '#deck>img')},
										function (g) { return game.setData('update', 
											function (h) { return helper.chainer(game, that, 
												function (i) { return game.fullOffsetList()},
												function (i) { return game.updateDataKeys()},
												function (i) { return game.removeMove()},
												function (i) { console.log(game.game.movelist)}
												)}
											)}
										)}
									)}
								)}
							)}
					): game }
				)
		})
	})
	$(this).on('keyup', window, function(event) {
		gameDeferred.done(function (game) {
			return game.defaulted([], 'keys')
		})
	})
})