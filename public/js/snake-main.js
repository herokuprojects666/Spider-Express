define(['underscore', 'jquery', 'helpers'], function (_, $, helper) {
	var addFood = function(length, firstClass, secondClass, border) {
		console.log('here')
		return _.each(length, function (ele) {
			var coords = determineCoords(border)
			var element = document.getElementById(_.first(coords) + '-' + helper.second(coords))
			while ( $(element).hasClass(firstClass) || $(element).hasClass(secondClass) ) {
				coords = determineCoords(border)
				element = document.getElementById(_.first(coords) + '-' + helper.second(coords))
			}
			console.log(coords)
			$(element).addClass(firstClass)
		})
	}

	var changeDirection = function(oppositeDir, newDir) {
		this.direction = this.direction != oppositeDir ? newDir : this.direction  
	};

	var determineCoords = function(border) {	
		var xCoord = helper.randomNumber($('#x').val(), border, ($('#x').val() - border) )
		var yCoord = helper.randomNumber($('#y').val(), border, ($('#y').val() - border) )
		return [xCoord, yCoord]
	}

	var createGrid = function() { 
		var width = $('#x').val()
		var height = $('#y').val()
		if (height == '' || width == '') {
			$('.error').html("Error. Didn't fill in both fields")
			return
		}
		var board = ''
		_.each(_.range(height), function (ele, index) {
			board += '<div id="board">'
			_.each(_.range(width), function (elem, ind) {
				board += '<div class="cell"' + 'id="' + ind + '-' + index + '">' + '</div>'
			})
			board += '</div>'
		})	
		$('#game').html(board)
	}

	var endGame = function() {
		var that = this
		var snake = _.map(this.snake, function (ele) {
			var duplicate = _.reduce(that.snake, function (memo, elem) {
				return _.isEqual(ele, elem) ? [].concat.call([], memo, [elem]) : memo
			}, [])
			return duplicate.length > 1 ? false : true
		})

		if(_.contains(snake, false)) {
			alert('end game')
			window.clearTimeout(this.intervals)
			this.intervals = true
		}
	}

	var initial = function() {
		var x = $('#x').val()
		var y = $('#y').val()
		var xCoord = Math.ceil(x / 2)
		var yCoord = Math.ceil(y / 2)
		this.snake = [[xCoord, yCoord]]
		var element = $('#' + xCoord + '-' + yCoord)
		$(element).attr('class', 'snake cell')
	}

	var initialDirection = function() {
		var number = Math.ceil(Math.random() * 20);
		return _.map(_.range(1), function (ele) {
			return number <= 5 ? 'left' : number > 5 && number <= 10 ? 'right' : number > 10 && number <= 15 ? 'up' : 'down'
		}).join('')
	}

	var increaseScore = function() {
		return this.score = this.snake.length * 10
	}

	var increaseLevel = function() {
		return this.score >= 150 && this.score < 300 ? this.level = 1 : 
			   this.score >= 300 && this.score < 450 ? this.level = 2 :
			   this.score >= 450 ? this.level = 3 : this.level = 0
	}

	var increaseSpeed = function() {
		return this.score >= 150 && this.score < 300 ? this.speed = 300 : 
			   this.score >= 300 && this.score < 450 ? this.speed = 75 : 
			   this.score >= 450 ? this.speed = 50 : this.speed = this.speed
	}

	var moveSnake = function(cb) {
		var speed = this.speed
		return typeof this.intervals == 'boolean' ? null : this.intervals = setTimeout(function (callback, context) {
			var that = context
			var direction = that.direction
			var tail = _.last(that.snake)
			var head = _.first(that.snake)
			var xCons = +_.first(tail)
			var xInc = +_.first(tail) + 1
			var xDec = _.first(tail) - 1
			var yCons = +helper.second(tail)
			var yInc = +helper.second(tail) + 1
			var yDec = helper.second(tail) - 1
			var element = document.getElementById(xCons + '-' + yCons)
			var headEle = document.getElementById(_.first(head) + '-' + helper.second(head))
			var truthy = _.map(that.foods, function (ele) {
				var addFood = [].concat.call([], that.foodToEat, _.range(that.foodValues[ele]))
				return $(element).hasClass(ele) ? (true, _.extend(that, {'foodToEat' : addFood}), $(element).removeClass(ele))  : false
			})
			_.each(that.snake, function (ele) {
				var elem = document.getElementById(_.first(ele) + '-' + helper.second(ele))
				$(elem).addClass('snake')
				if (_.isEmpty(that.foodToEat)) {
					$(headEle).removeClass('snake')
				}
			})
			
			var snake = _.isEmpty(that.foodToEat) ? _.rest(that.snake) : that.snake			
			direction == 'up' ? (that.snake = [].concat.call([], snake, [[xCons, yDec]]), $('#' + xCons + '-' + yDec).addClass('snake'), that.foodToEat = _.rest(that.foodToEat)) :
			direction == 'down' ? (that.snake = [].concat.call([], snake, [[xCons, yInc]]), $('#' + xCons + '-' + yInc).addClass('snake'), that.foodToEat = _.rest(that.foodToEat)) : 
			direction == 'left' ? (that.snake = [].concat.call([], snake, [[xDec, yCons]]), $('#' + xDec + '-' + yCons).addClass('snake'), that.foodToEat = _.rest(that.foodToEat)) :
			(that.snake = [].concat.call([], snake, [[xInc, yCons]]), $('#' + xInc + '-' + yCons).addClass('snake'), that.foodToEat = _.rest(that.foodToEat))
			
			callback.call(that)
			return moveSnake.call(that, callback)
		}, speed, cb, this)
	}

	var numberOfItems = function() {
		var number = ($('#x').val() * $('#y').val()) / 20
		var array = []
		var list = _.each( _.range(1, number + 1), function (e, i) {
			return _.each(_.range(1, number + 1), function (el, ind) {
				return _.each(_.range(1, number + 1), function (ele, index) {
					return e + el + ele == Math.ceil(number) ? array.push([e, el, ele]) : null
				})
			})
		})
		console.log(array)
		console.log(number)
		return array[Math.ceil(Math.random() * array.length)]
	}

	var placeItems = function (array, border) {
		var that = this
		console.log(this)
		console.log(array)
		return _.each(array, function (ele, index) {
			return addFood(_.range(ele), that.foods[index], 'snake', 4)
		})
	}

	var switchDirections = function(direction) {
		switch(direction) {
			case 37 : 
			return changeDirection.call(this, 'right', 'left')
			break
			case 39 : 
			return changeDirection.call(this, 'left', 'right')
			break
			case 38 :
			return changeDirection.call(this, 'down', 'up')
			break
			case 40 :
			return changeDirection.call(this, 'up', 'down')
		}
	}

	return {
		addFood : addFood,
		createGrid : createGrid,
		determineCoords : determineCoords,
		endGame : endGame,
		increaseScore : increaseScore,
		increaseLevel : increaseLevel,
		increaseSpeed : increaseSpeed,
		initial : initial,
		initialDirection : initialDirection,
		moveSnake : moveSnake,
		numberOfItems : numberOfItems,
		placeItems : placeItems,
		switchDirections : switchDirections
	}
})

