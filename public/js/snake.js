require(['requireConfig'], function() {
	require(['jquery'], function ($) {
		require(['snakeMain', 'helpers', 'animation', 'bootstrap'], function (snake, helper, animation) {
			animation.initiate.call(this)
			$(document).ready(function () {
				var construct, game, width, height, initial;
				$(window).on('resize', function () {
					return animation.initiate.call(this)
				})
				$('#Create').on('mousedown', function () {
					$('.error').html('')
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
					initial = helper.addToProto(snake, construct)
					game = new initial
					console.log(game)

					return helper.chainer(game, game.createGrid(), null,
						function (a) { return $('.error').html() != '' ? null : helper.chainer(game, null, null,
							function (b) { console.log(this)
							 $('#tiles').css('display', 'unset')
										$('.indent').css('display', 'block')
											$('#container').width($(window).width())
											$('#container').height($(window).height() - 50)},
							function (b) { return game.initial.call(this)},
							function (b) { width = $('#board').children().last().offset()
										   return $('#container').width(width['left'] - 5)},
							function (b) { height = $('#game').children().eq(-1).position()
										   return $('#container').height(height['top'] + 60)},
							function (b) { return game.numberOfItems()},
							function (b) { return game.placeItems.call(this, b, 4)}
							)
						})
				})

				$('#Play').on('mousedown', function() {
					$('#Stats').css('display', 'unset')
					$('#Score').css('display', 'unset')
					$('#Level').css('display', 'unset')

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