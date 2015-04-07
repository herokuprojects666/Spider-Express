require(['requireConfig'], function() {
	require(['jquery'], function ($) {
		require(['snakeMain', 'helpers', 'bootstrap', 'jqueryui'], function (snake, helper) {
			$(document).ready(function () {
				var construct, game, width, height;
				
				$('#Create').on('mousedown', function () {
					$('#tiles').css('display', 'unset')
					$('.indent').css('display', 'block')
					construct = function() {
						this.direction = snake.initialDirection.call(this)
						this.foods = ['easy', 'medium', 'hard']
						this.foodToEat = []
						this.intervals = []
						this.foodValues = {'easy' : 1 ,'medium' : 2 ,'hard' : 3}
						this.score = 0
						this.level = 0
						this.speed = 500
					};
					game = helper.addToProto(snake, construct)

					$('#container').width($(window).width())
					$('#container').height($(window).height() - 50)				
					return helper.chainer(game, game.createGrid(), null, 
						function (a) { return game.initial.call(this)},
						function (a) { width = $('#board').children().last().offset()
										return $('#container').width(width['left'] + 10)},
						function (a) { height = $('#game').children().eq(-1).position()
										return $('#container').height(height['top'] + 60)},
						function (a) { return game.numberOfItems()},
						function (a) { return game.placeItems.call(this, a, 4)})					
				})
				
				$('#Play').on('mousedown', function() {
					$('#Stats').css('display', 'unset')
					$('#Score').css('display', 'unset')
					$('#Level').css('display', 'unset')
					$('.indent').css('left', '-375px')
					return helper.chainer(game, this, null, 
						function (a) { return game.moveSnake.call(this,
							function () { return helper.chainer(this, null, null, 
								function () { return $('#score').html(this.increaseScore())},
								function () { return $('#level').html(game.increaseLevel.call(this))},
								function () { return game.increaseSpeed.call(this)},
								function () { return game.endGame.call(this)})
						}, this.speed)
					})
				})
				
				$(this).on('keydown', function (e) {
					return game.switchDirections.call(game, e.which)
				})				
			})
		})
	})
})