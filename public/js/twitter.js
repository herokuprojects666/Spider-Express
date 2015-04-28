require(['./requireConfig'], function () {
	require(['jquery'], function ($) {
		require(['helpers', 'underscore', 'tweets', 'animation'], function (helper, _, tweet, animation) {
			animation.initiate.call(this)
			var constructor = function () {
			}
			var importHelper = helper.addToProto(helper, tweet.construct)
			var importTweet = helper.addToProto(tweet, tweet.construct)
			var menu = new importTweet(constructor)

			$(document).ready(function () {
				var width;
				var searchPhrase;
				$(this).on('mousemove', function (e){
					width = +$(window).width()
				})

				helper.chainer(menu, null, null,
					function () { return menu.fetchData.call(this, menu.buildTable, menu.partial(menu.recursiveSwitch, null, menu.adjustOffset))})

				$(window).on('resize', function (e) {
					animation.initiate.call(this)
					var newWidth = $(window).width()
					if (newWidth > width) {
						return menu.recursiveSwitch.call(menu, true, menu.adjustOffset)
					} else if (newWidth < width) {
						return menu.recursiveSwitch.call(menu, null, menu.adjustOffset)
					} else {
						null
					}
				})

				$('.searchBtn').on('keydown', function(e) {
					var item = $('.searchBtn').val()
					return e.which == 13 ? $.ajax({
						url : '/home/' + $('.gameboard').attr('id').toLowerCase() + '/search/',
						data : 'hashtags=' + item + '&user=' + item,
						type : 'get',
						success : function(data) {
							sessionStorage.setItem(item, JSON.stringify(data))
							$('.hashtags').val($('.searchBtn').val())
							$('.user').val($('.searchBtn').val())
							$('.submitting').submit()
						}
					}) : null
				})
			})
		})
	})
})