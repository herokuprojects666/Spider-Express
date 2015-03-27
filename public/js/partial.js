define(['helpers','underscore', 'ajax'], function (helper, _, server) {
	var build = function(memo) {
		return _.isEmpty(this.game.pseudoHovered) ? this.game : (_.extend(this.game, {'hoveredData' : [].concat.call([], this.game.hoveredData, memo)}),
																this.curry(this.buildValues, memo))
	};

	var calculateLeft = function(memo, hovered) {
		return _.isEmpty(this.game.pseudoHovered) ? this.game : (this.curry(this.calculateLeft, this.switchARoo(this.game.hovered)))
	};

	var completedSuit = function(card) {
		var completedStackDeferred = new $.Deferred()
		var stackMoveDeferred = new $.Deferred()
		var that = this
		var completeSuit = this.completedSuit()
		var defaulted = function() { return that.defaulted([], "cardStackHTML", 'clicked', "clickedMatches", "currentRow", "deckHTML", "draggedData", 
		"draggedEleOffsets", "draggedEleString", "draggedElements", "draglist", "droppables", "elementlist", "fullBaseValue", "hoverElements", 
		"hoverMatches", "hoverString", "hovered", "hoveredData", "initialOffset", "keys", "list", "oldHoverCard", "previousRow", 
		"ImageDimensions", "intervals", "pseudoDragged", "pseudoHovered", "tempOffsets")}

		return !_.isEmpty(completeSuit) ? helper.chainer(this, card, [completeSuit],
				function (a) { return defaulted()}, 
				function (a, b) { return _.map(b, that.switchARoo)},
				function (a, b) { return _.map(a, function (ele) { return that.adjustedOffset('#deck', ele)})},
				function (a, b) { return helper.chainer(that, card, [b, a, _.map(b, that.switchARoo)], 
					function (b) { return that.stackLocation()},
					function (b) { return that.parentOffsets(helper.returnSubString(b, '<', true), '#deck', 13)},
					function (b, c, d, e) { return that.dealCards(true, c, b, null, 100, null, completedStackDeferred, [c, e, d], 
						function (c, d, e) { return helper.chainer(that, card, [that.stackLocation(), c, d, e],
							function (d, e, f, g, h) { return that.insertDeckCard(true, e, _.range(1), null, null, [f, g, h], 
								function (e, f, g) { return helper.chainer(that, card, [e, f, g],
									function (f, g, h, i) { return that.determineStackMove(_.first(i), stackMoveDeferred, [g, h],
										function (g, h) { return helper.chainer(that, card, [g, h], 
											function (h, i, j) { return that.addCompletedStack(i, j)},
											function () { return that.setData('update', null, 
												function () { return that.fullOffsetList()}
											)},
											function () { return that.defaulted([], 'offsets', 'mousedown', 'oldHoverCard')},
											function () { return $('.count').html(that.updateMoveCount())},
											function () { return $('.score').html(that.decreaseScore())},
											function () { return that.endGame(
												function () { return helper.chainer(that, that.defaulted(true, 'endGame'), null, 
													function () { return _.map(that.game.stackSelectors, function (ele) { return $(ele).eq(0).remove()})},
													function () { return server.submitScore()}
												)}
											)}
										)}
									)}
								)}
							)}
						)} 
					)}
				)}
			) : helper.chainer(this, card, null,
				function (a) { return defaulted()}, 
				function (a) { return that.defaulted([], 'offsets', 'mousedown')},
				function (a) { return $('.count').html(that.updateMoveCount())},
				function (a) { return $('.score').html(that.decreaseScore())}
			)
	};

	var list = function(memo) {
		return _.isEmpty(this.game.pseudoHovered) ? this.game : (this.curry(this.objectList, memo))
	};

	var set = function (memo, hovered, previousRow, index) {
		var dragged = this.switchARoo(hovered);
		var hovered = this.switchARoo(previousRow[index]);
		if (_.isArray(hovered))
			hovered = that.switchARoo(_.last(hovered))

		return _.isEmpty(this.game.pseudoHovered) ? this.game : (console.log(this.game.pseudoHovered), this.curry(this.setElements, hovered, dragged))
	};

	var update = function(arg) {
		return _.isEmpty(this.game.pseudoHovered) ? this.game : (this.curry(this.updateSingleOffset, this.game.clicked))
	};

	var updateData = function(object, card, prevRow, index) {
		var hovered = helper.getFirstKey(this.game.pseudoHovered);
		if (_.isArray(this.game.pseudoHovered)) {
			hovered = _.map(this.game.pseudoHovered, helper.getFirstKey)
		}
		return _.isEmpty(this.game.pseudoHovered) ? this.game : (_.extend(this.game, {'hoverMatches' : [].concat.call([], this.game.hoverMatches, hovered),
							 														  'clickedMatches' : [].concat.call([], this.game.clickedMatches, helper.getFirstKey(this.game.pseudoDragged))}),
																					  this.curry(this.updateData, 'fixed'))
	};

	return {
		set : set,
		calculateLeft : calculateLeft,
		completedSuit : completedSuit, 
		build : build,
		list : list,
		update : update,
		updateData : updateData
	}
})