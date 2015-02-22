var curried = (function() {
	var build = function(arg) {
		// console.log(arg)
		// console.log(arguments)
		// _.extend(this.game, {'hoveredData' : [].concat.call([], this.game.hoveredData, arg)})
		return _.isEmpty(this.game.pseudoHovered) ? this.game : (_.extend(this.game, {'hoveredData' : [].concat.call([], this.game.hoveredData, arg)}),
				this.curry(this.buildValues, [arg]))
	}
	var calculateLeft = function(arg) {
		// console.log(arguments)
		// console.log(arg)
		return _.isEmpty(this.game.pseudoHovered) ? this.game : this.curry(this.calculateLeft, this.switchARoo(this.game.hovered))
	}

	var list = function(arg) {
		// console.log(arg)
		// console.log(arguments)
		return _.isEmpty(this.game.pseudoHovered) ? this.game : this.curry(this.objectList, arg)
	}
	var set = function (arg) {
		var hovered = this.switchARoo($('#' + helper.getFirstKey(this.game.pseudoHovered)))
		if (_.isArray(this.game.pseudoHovered)) {
			hovered = this.switchARoo($('#' + helper.getFirstKey(_.last(this.game.pseudoHovered))))
		}
		var dragged = $('#' + helper.getFirstKey(this.game.pseudoDragged))
		return _.isEmpty(this.game.pseudoHovered) ? this.game : this.curry(this.setElements, arg, hovered, dragged)
	}

	var update = function(arg) {
		return _.isEmpty(this.game.pseudoHovered) ? this.game : this.curry(this.updateSingleOffset, arg, this.game.clicked)
	}

	var updateData = function(arg) {
		// _.extend(this.game, {'hoverMatches' : [].concat.call([], this.game.hoverMatches, helper.getFirstKey(this.game.pseudoHovered)),
		// 					 'clickedMatches' : [].concat.call([], this.game.clickedMatches, helper.getFirstKey(this.game.pseudoDragged))})
		var hovered = helper.getFirstKey(this.game.pseudoHovered)
		if (_.isArray(this.game.pseudoHovered)) {
			hovered = _.map(this.game.pseudoHovered, helper.getFirstKey)
		}
		return _.isEmpty(this.game.pseudoHovered) ? this.game : (_.extend(this.game, {'hoverMatches' : [].concat.call([], this.game.hoverMatches, hovered),
							 														  'clickedMatches' : [].concat.call([], this.game.clickedMatches, helper.getFirstKey(this.game.pseudoDragged))}),
																					  this.curry(this.updateData, 'fixed'))
	}
	return {
		set : set,
		calculateLeft : calculateLeft,
		build : build,
		list : list,
		update : update,
		updateData : updateData
	}
})();