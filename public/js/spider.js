require(['./requireConfig'], function () {
	require(['jquery'], function ($) {
		require(['ajax', 'helpers', 'html','main', 'partial', 'underscore', 'jqueryui', 'bootstrap'], function (server, helper, html, Spider, curried, _) {
			(function() {
				return server.fetchScores( function (data) {
					sessionStorage.setItem('scores', JSON.stringify(data.scores))
					return helper.chainer(game, data, null, 
						function (a) { return server.extractScores(a.scores)},
						function (a) { return server.buildTable(a)})
				})
			}).call(this)
			$(document).ready(function() {
				var gameDeferred = new $.Deferred();
				$('#setup button').on('mousedown', function() {
					var game = new Spider;
					var deckDeferred = new $.Deferred();
					var cardDeferred = new $.Deferred();
					var bottomdeck = new $.Deferred();
					var that = $(this);
					return game.initialCondition(that, 
						function (t) { return helper.chainer(game, t, [sessionStorage.setItem('difficulty', t), game.defaulted(t, 'difficulty')],
							function (b) { return game.difficulty(t)},
							function (b) { return game.createDeck(b)},
							function (b) { return game.shuffleDeck()},
							function (b) { return game.generateBoard(_.range(5), _.range(8))},
							function (b) { return game.dealDeck(8, 'deckCard', '#deck', _.range(1, 49), 20, deckDeferred, 
								function (c) { return helper.chainer(game, that, null,
									function (d) { return game.setData('update')},
									function (d) { return game.fullOffsetList()}, 
									function (d) { return game.calculateOffset()},
									function (d) { return _.map(d, function (ele) { return {'left' : ele['left'], 'top' : +ele['top'] + 20}})}, 
									function (d) { return game.dealCards(null, _.range(1, 9), d, 'card', 20, null, cardDeferred, null, 
										function (e) { return helper.chainer(game, that, null,
											function (f) { return _.map(_.range(41, 97), function (ele) { return {'left' : -140, 'top' : -100}})},
											function (f) { return game.dealCards(null, _.range(41, 97), f, 'deckCard', 20, null, bottomdeck, null, 
												function (g) { return helper.chainer(game, that, game,
													function (h) { return game.saveHTML()},
													function (h) { return game.setData(null)},
													function (h) { return game.setData('update')},
													function (h) { return game.calculateOffset()},
													function (h) { return game.fullOffsetList()},
													function (h, i) { return server.updateGame.call(this,
														function (data) { return helper.chainer(game, that, data, 
															function (i) { return $('.count').empty()},
															function (i) { return $('.score').html(2000)},
															function (i) { return game.clearStacks()},
															function (i) { return game.hiddenElements()}
														)}
													)}
												)}
											)}
										)}
									)}
								)}
							)}
						)},
						function (t) { return server.loadGame(
							function (data) { return helper.chainer(game, that, [$('div>.error').html('')], 
								function (a) { return game.populateBoard(data)},
								function (a) { return game.fullOffsetList()},
								function (a) { $('#game').val('')},
								function (a) { return game.hiddenElements()}
							)}, 
							function (data) {
								$('div>.error').html(data.error) 
								$('#game').val('')
							})
						},
						function (t) {
							var defaulted = function() { return game.defaulted([], "cardStackHTML", 'clicked', "clickedMatches", "currentRow", "deckHTML", "draggedData", 
							"draggedEleOffsets", "draggedEleString", "draggedElements", "draglist", "droppables", "elementlist", "fullBaseValue", "hoverElements", 
							"hoverMatches", "hoverString", "hovered", "hoveredData", "initialOffset", "keys", "list", "oldHoverCard", "previousRow", 
							"ImageDimensions", "intervals", "pseudoDragged", "pseudoHovered", "tempOffsets")}
							return gameDeferred.resolve(game, defaulted)
						})
				})
				$('#save').on('mousedown', function() {
					var that = this;
					gameDeferred.done(function (game) {
						return game.offsetCheck([game], 
							function (a) { },
							function (a) { return helper.chainer(game, that, null,
								function (b) { return game.defaulted([], 'hiddenElements')},
								function (b) { return game.saveHTML()},
								function (b) { return server.updateGame.call(this,
									function (c) { return game.hiddenElements()}
								)}
							)}
						)
					})
				})
				$('#cheat').on('mousedown', function () {
					gameDeferred.done(function (game) {
						if (helper.truthy(game.game.animation)) {
							return helper.chainer(game, null, "#deck>img[id*='deck']", 
								function (a, b) { return game.cheat(350)
							})
						}
						return false
					})
				})

				$('#main_selector li').on('mousedown', function () {
					return (function () {
						var data = $.parseJSON(sessionStorage.getItem('scores'));
						var list = _.each($('#main_selector li'), function (ele) {
							return $(ele).hasClass('active') ? $(ele).removeClass('active') : null
						});
						$(this).addClass('active')
						var scores = server.extractScores(data);
						return server.buildTable(scores)
					}).call(this)
				})

				$('#sub_selector li').on('mousedown', function () {
					return (function () {
						var data = $.parseJSON(sessionStorage.getItem('scores'));
						var list = _.each($('#sub_selector li'), function (ele) {
							return $(ele).hasClass('active') ? $(ele).removeClass('active') : null
						});
						$(this).addClass('active')
						var scores = server.extractScores(data);
						return server.buildTable(scores)
					}).call(this)
				})

				$('#deck').on('mousedown', 'img', function(event) {		
					var that = this;
					gameDeferred.done(function (game) {
						if (!helper.truthy(game.game.allowEvent) || !_.isEmpty(game.game.intervals) || !_.isEmpty(game.game.mousedown) || helper.truthy(game.game.endGame))
							$(that).draggable('disable') 
						else {
							$(that).draggable('enable')
							return helper.chainer(game, game.calculateOffset(), that,
								function (a) { return game.hiddenElements()},
								function (a) { return game.extractIdentity(that)}, 
								function (a) { return game.extractCard(a)}, 
								function (a) { return game.validDroppable(a)}, 
								function (a, b) {return game.buildValueList(a, b)},
								function (a) { return game.calculateLeft()}, 
								function (a) { return game.buildDragList(a)},
								function (a) { return _.map(a, game.switchARoo)}, 
								function (a) { return game.defaulted(a, 'draglist')},
								function (a) { return game.disableDragging('#deck>img')}
							)
						}
					})
				})

				$('#deck').on('mouseenter', 'img', function() {
					var that = this
					gameDeferred.done(function (game) {
						$(that).draggable()
						var obj = game.defaulted(false, 'allowEvent');
						if (!_.isEmpty(game.game.intervals) || helper.truthy(game.game.endGame)) {
							$(that).draggable('disable')
						} else 
							return helper.chainer(game, that, [game.calculateLeft(game.switchARoo(that))], 
								function (a, b) { return helper.compareOffsets(game.switchARoo(that), b, helper.lastIndex, game.separatedList)},
								function (a) { return _.isBoolean(a) ? a : helper.booleanArray(_.last(a), game.switchARoo(that))},
								function (a) { return a == false || $(that).attr('id') == 'any' ? $(that).draggable('disable') : $(that).draggable('enable')},
								function (a) { return game.defaulted(true, 'allowEvent')}
							)
					})
				})
				$('#deck').on('mouseleave', 'img', function() {
					var that = this;
					gameDeferred.done(function (game) {
						return $(that).hasClass('ui-draggable', 'ui-draggable-handle') ? $(that).removeClass('ui-draggable', 'ui-draggable-handle') :
								$(that).hasClass('ui-draggable') ? $(that).removeClass('ui-draggable') :
								$(that).hasClass('ui-draggable-handle') ? $(that).removeClass('ui-draggable-handle') : 
								$(that).attr('id') == 'any' ? $(that).draggable('disable') : $(that)
					})
				})

				$('#deck').on('drag', 'img', function(event) {
					var that = this;
					gameDeferred.done(function (game, defaulted) {
						var reverting = function(deferred, callback, args) {
							return game.unacceptableDraggable(that, deferred, callback, args)
						}
						if (!helper.truthy(game.game.allowEvent) || _.isEmpty(game.game.data) || helper.truthy(game.game.endGame)) {
							$(that).draggable('disable')
						} else {				
							$(that).draggable('disable')
							var deferred = new $.Deferred();
							var deckCardDeferred = new $.Deferred();
							var specialCase = new $.Deferred();
							var completedStackDeferred = new $.Deferred();
							var stackMoveDeferred = new $.Deferred();
							if (_.isEmpty(game.game.mousedown)) {
							return helper.chainer(game, that, defaulted,
								function (a) { $(that).draggable('enable')},
								function (a) { return game.determineHoverElement(that)}, 
								function (a, b) { return game.setElements(a, that)},
								function (a) { return game.catchError()},
								function (a) { if (!_.isEmpty(a)) return game.fixError(a)},  
								function (a, b) { return game.dragging(b,
									function (c) { return game.intervals(reverting, 1, deferred, [c],
										function (d) { return helper.chainer(game, that, d, 
											function (e) { return game.clearIntervals()},
											function (e) { return game.defaulted($(that).attr('id'), 'mousedown')},
											function (e) { return game.revertZIndex('draglist')},
											function (e, f) { return f()},
											function (e) { return game.defaulted([], 'offsets', 'mousedown')}								
										)}
									)}, 
									function (c) { return helper.chainer(game, that, [c],
										function (d) { return game.defaulted($(that).attr('id'), 'mousedown')},
										function (d) { return game.fixCss()},
										function (d) { return game.determinePosition()},
										function (d, e) { return game.deckCard(d, null, deckCardDeferred, [e], 
											function (e) { return helper.chainer(game, that, e,
												function (f, g) { return game.setData('update', [g],
													function (g) {return helper.chainer(game, game.updateDataKeys(), g,
														function (h) { return game.calculateLeft(game.switchARoo(that))},
														function (h) { return game.objectList(h)},
														function (h, i) { return helper.chainer(game, that, [i, h],
															
															function (h, i, j) { return game.buildValues(j)},
															function (h, i, j) { return game.updateData(specialCase, null, [i, j],
																function (g, h) { return helper.chainer(game, game.calculateLeft(), [g, h], 
																	function (i) { return game.objectList(i, true)},
																	function (i) { return game.fixOldData(i)}, 
																	function (i) { return game.fixBaseString()}, 
																	function (i) { return game.calculateLeft(game.switchARoo(that))},
																	function (i) { return game.objectList(i)},
																	function (i) { return game.buildValues(i, true)},
																	function (i) { return game.updateData('fixed')}
																)},
																function (g) { return helper.chainer(game, game.addMove(), that, 
																	function (i) { return game.fullOffsetList()},
																	function (i, j) { return curried.completedSuit.call(this, j)})
																})
															})
														})
													})
												})
											})
										})
									})
								})
							}
							return false
						}
					})
				})

				$('#bottomDeck').on('mousedown', 'img', function() {
					var that = this;
					gameDeferred.done(function (game, defaulted) {
						var dealingRow = function(deferred, callback) {
							return game.dealRow(_.range(8), deferred, callback)
						};
						var fadingOut = function(deferred, callback, args) {
							return game.fadeOut(_.range(8), deferred, 1250, '#bottomDeck>img', '#deck', args, callback)
						};
						var fadeOutDeferred = new $.Deferred();
						var dealingRowDeferred = new $.Deferred();

						if (_.isEmpty(game.game.data) || !_.isEmpty(game.game.intervals))
							$(that).off('mousedown', 'img')
						else
							return helper.chainer(game, that, defaulted,
								function (a, b) { return game.offsetCheck(b, 
									function (b) { },
									function (b) { return helper.chainer(game, that, [game.calculateOffset(), b],
										function (c) { return game.selectElements('#bottomDeck>img', 8, 'first')},
										function (eles, sorted, defaulted) {return helper.chainer(game, that, [eles, sorted, defaulted],
											function (e, f, g) { return _.map(g, function (ele) { return {'left' : ele['left'], 'top' : +ele['top'] + 20}})},
											function (e, f, g, h) { return game.dealCards(true, f, e, null, 75, null, dealingRowDeferred, [e, g, h], 
												function (h, i, j) { return helper.chainer(game, that, [h, i, j], 
													function (g, h, i, j) { return game.intervals(fadingOut, 75, fadeOutDeferred, [i, j], 
														function (i, j) { return helper.chainer(game, that, [game.removeElements(_.range(8), '#bottomDeck>img'), i, j],
															function (j) { return game.setData('update')},
															function (j) { return game.updateDataKeys()},
															function (j, k, l) { return _.map(l, game.switchARoo)},
															function (j, k, l, m) { return helper.chainer(game, that, [j, m],
																function (k, l) { return game.defaulted(l, 'previousRow')},
																function (k) { return game.calculateOffset()},
																function (k) { return _.map(k, game.switchARoo)},
																function (k) { return game.defaulted(k, 'currentRow'), k},
																function (k, m, l) { return helper.chainer(game, that, [m, k, l], 
																	function (n, o, p, q) { return helper.qualifiers(game, [o], p, game.extractIdentity, game.extractCard, 
																	game.validDroppable, game.buildValueList,game.pseudoValues, curried.set, curried.calculateLeft, 
																	curried.list, curried.build, curried.updateData, curried.update)},
																	function (n) { return game.fullOffsetList()},
																	function (n, o, p) { return game.idList(p)},
																	function (n) { return game.addMove(n)},
																	function (n) { return curried.completedSuit.call(this, that)}												
																)}
															)}
														)}
													)}
												)}
											)}
										)}
									)}
								)}
							)
					})

				})
				$(this).on('keydown', window, function (event) {
					var that = this;
					gameDeferred.done(function (game) {
						var bottomDeck = function(deferred, callback, args) {
							return game.insertDeckCard(null, $('#bottomDeck>img'), _.range(8), {'left' : -140, 'top' : -100}, $('#bottomDeck'), args, callback)
						};
						if (helper.truthy(game.game.endGame))
							return false
						else
							var keydownDeferred = new $.Deferred();
							var revertRowDeferred = new $.Deferred();
							var undoMoveFadeOut = new $.Deferred();
							var bottomdeckDeferred = new $.Deferred();
							var completedStack = new $.Deferred();
							var revertedCardsDeferred = new $.Deferred();
							return helper.chainer(game, event.which, null,
								function (a) { return game.keyDownAdd(a)},
								function (a) { return game.checkForKeys([90, 17])},
								function (a) { return a == true ? game.keyDownEvent('row', keydownDeferred, 
									function (b, c, d, e, f) { return game.determineMove('oldHoverCard', b, null, [c, d, e, f],
										// completed stack/no completed stack for case where no deckcard is revealed at drag location
										function (c, d, e, f, g) { return game.determineMove('completedStack', c, null, [d, e, f, g],
											function (d, e, f, g, h) { return h(d, e, g)},
											function (d, e, f, g, h) {  return game.determineMove('completedStack.oldHoverCard', d, d.completedStack, [e, f, g, h],
													function (e, f, g, h, i, j) { return g(f, e, i, j) },
													function (e, f, g, h, i, j) { return h( helper.partial(g, f, e, i, j))}
											)}   
										)},
										//completed stack/no completed stack for case where deckcard is revealed at drag location
										function (c, d, e, f, g) { return game.determineMove('oldHoverElements', c, c.oldHoverCard, [d, e, f, g], 
											function (d, e, f, g, h, i) { return game.determineMove('completedStack', d, null, [e, f, g, h, i], 
												function (e, f, g, h, i, j) { return h(helper.partial(j, e, f, i))},
												function (e, f, g, h, i, j) { return game.determineMove('oldHoverCard', e, e.completedStack, [g, h, i, j], 										
													function (f, g, h, i, j, k) { return i(helper.partial(h, g, f, j, k))},										
													function (f, g, h, i, j, k) { return i(helper.partial(i, g, f, j, k), h)}
												)}
											)},								
											function (d, e, f, g, h, i) { return game.determineMove('completedStack', d, null, [e, f, g, h, i], 
												function (e, f, g, h, i, j) { return j(e, f, i)},
												function (e, f, g, h, i, j) { return game.determineMove('completedStack.oldHoverCard', e, e.completedStack, [g, h, i, j], 
													function (f, g, h, i, j, k) { return h(g, f, j, k)},
													function (f, g, h, i, j, k) { return i(helper.partial(h, g, f, j, k))}
												)}
											)}
										)}
									)},
									//revert row move
									function (b, c, d, e, f, g) { return game.determineMove('completedStack', b, null, [c, d, g], 
										function (c, d, e, f) { return f(c)},
										function (c, d, e, f) { return game.determineMove('oldHoverCard', c, c.completedStack, [d, e, f], 
											function (d, e, f, g, h) { return f(e, d, null, h)},
											function (d, e, f, g, h) { return g(helper.partial(f, e, d, null, h))}
										)}
									)},
									
									function (c, d, e, f) { return game.dealCards(true, game.mapSelectors(c.elements), c.offsets, null, 50, null, completedStack, [d, c, e], f)},
									
									function (c) { 
										var args = _.rest(arguments);
										return game.rebuildDeckCard(c, args)
									},
									
									function (c, d) { return helper.chainer(game, that, [c, d], 
										function (d) { return game.updateData(null, 'update game data')},
										function (d, e, f) { return helper.existy(f) && f.elements ? game.revertZIndex(null, game.mapSelectors(f.elements), _.first(f.offsets)) : null},
										function (d, e, f) { return helper.existy(e) && e.draggedEleOffsets ? game.revertZIndex(null, game.mapSelectors(e.draggedElements), _.first(e.draggedEleOffsets)) : null},  
										function (d, e, f) { return game.setData('update', [e, f],
											function (e, f) { return helper.chainer(game, that, [e,f], 
												function (f) { return game.fullOffsetList()},
												function (f) { return game.updateDataKeys()},
												function (f) { return game.removeMove()},
												function (f) { return $('.count').html(game.updateMoveCount())},
												function (f, g) { if (_.has(g, 'completedStack')) return game.removeElements(_.range(0, 1), game.lastStack())},
												function () { $('.score').html(game.decreaseScore())}
											)}
										)}
									)},
									
									function (c, d, e) { return game.dealCards(true, game.mapSelectors(c.draggedElements), c.draggedEleOffsets, null, 50, null, revertedCardsDeferred, [c, d], e)},

									function (b) { return helper.chainer(game, that, [game.mapSelectors(b.rowCards), b],
										function (c) { return _.map(_.range(8), function (ele) { return $('#bottomDeck>img').length == 0 ? {'left' : -140, 'top' : -100} :  $('#bottomDeck>img').position()})},
										function (c, d, e) { return game.dealCards(true, d, c, null, 100, null, revertRowDeferred, [d, e], 
											function (e, f) { return game.bottomDeckFadeOut(e, [f], undoMoveFadeOut, 
												function (f) { return game.intervals(bottomDeck, 50, bottomdeckDeferred, [f],
													function (g) { return helper.chainer(game, that, [g],
														function (h) { return game.updateData(null, 'update game data')},
														function (h) { return game.removeElements(game.ranger('#deck>img', 'last', 8), '#deck>img')},
														function (h, i) { return game.setData('update', [i],
															function (i) { return helper.chainer(game, that, [i],
																function (k) { return game.fullOffsetList()},
																function (k) { return game.updateDataKeys()},
																function (k) { return game.removeMove()},
																function (k) { $('.count').html(game.updateMoveCount())},
																function (k) { $('.score').html(game.decreaseScore())},
																function (k, l) { if (_.has(l, 'completedStack')) return game.removeElements(_.range(0, 1), game.lastStack())}
															)}
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
		})
	})
})