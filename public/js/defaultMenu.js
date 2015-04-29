require(['./requireConfig'], function () {
	require(['jquery'], function ($) {
		require(['helpers', 'underscore', 'animation'], function (helper, _, animation) {
			animation.initiate.call(this)
			var constructor = function () {
				this.directions = { 'up_right' : {'default' : 'up_right', 'opposite' : 'down_right', 'alt' : 'up_left', 'x' : 1, 'y' : 1, 'altX' : -1, 'altY' : -1, 'nextX' : 1, 'nextY' : -1},
									'up_left' : {'default' : 'up_left', 'opposite' : 'up_right', 'alt' : 'down_left', 'x' : 1, 'y' : -1, 'altX' : -1, 'altY' : 1, 'nextX' : -1, 'nextY' : -1},
									'down_left' : {'default' : 'down_left', 'opposite' : 'down_right', 'alt' : 'up_left', 'x' : 1, 'y' : 1, 'altX' : -1, 'altY' : -1, 'nextX' : -1, 'nextY' : 1},
									'down_right' : {'default' : 'down_right', 'opposite' : 'up_right', 'alt' : 'down_left', 'x' : 1, 'y' : -1, 'altX' : -1, 'altY' : 1, 'nextX' : 1, 'nextY' : 1}
				}
			}

			var importHelper = helper.addToProto(helper, constructor)
			var svgHelper = helper.addToProto(animation, constructor)
			var menu = new svgHelper(constructor)
			var elements = (function() {
				var that = this
				var list = _.map(_.range(30), function (ele, index) {
					var minWidth = 105
					var maxWidth = parseFloat($('#indexAnimation').css('width')) - 30
					var minHeight = 40
					var maxHeight = parseFloat($('#indexAnimation').css('height')) - 120
					var x = that.randomNumber(+$(window).width(), minWidth, maxWidth)
					var y = that.randomNumber(+$(window).height(), minHeight, maxHeight)
					var radius = that.randomNumber(100, 5, 40)
					return that.createObject('circle' + index, {'currentX' : x, 'currentY' : y, 'radius' : radius})
				})
				var object = this.mergeObjects(list)
				this.svgElements = object
			}).call(menu)


			$(document).ready(function () {

				$(window).on('resize', function () {
					animation.initiate.call(this)
				})
				console.log(menu)
				return (function() {
					menu.initialDirections.call(menu)
					menu.startAnimation.call(menu)
				}.call(menu))
			})
		})
	})
})