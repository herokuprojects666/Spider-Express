require(['./requireConfig'], function () {
	require(['jquery'], function ($) {
		require(['helpers', 'underscore', 'tweets', 'animation'], function (helper, _, tweet, animation) {
			animation.initiate.call(this)
			var constructor = function (uniqueIDfield) {
				this.keystrokes = ''
				this.searchPrefixes = ['-u', '-h']
				this.prefixClasses = {'-u' : 'searchUser', '-h' : 'searchHashtag'}
				this.searchError = 'Error. Missing -u or -h prefix', '14px'
				this.searchClasses = {'searchUser' : 'user', 'searchHashtag' : 'hashtags'}
				this.searchTypes = ['hashtags', 'user']
				this.uniqueIDField = uniqueIDfield

			}
			var importHelper = helper.addToProto(helper, tweet.construct)
			var importTweet = helper.addToProto(tweet, tweet.construct)
			var menu = new importTweet(constructor, $('.uniqueID').attr('id'))

			// new XMLSerializer().serializeToString()

			$(document).ready(function () {

				var width;
				var searchPhrase;
				$(this).on('mousemove', function (e){
					width = +$(window).width()
				})

				helper.chainer(menu, null, null,
					function () { $('.linebreak').length > 0 ? $('.linebreak').css('width', $(window).width() - 50) : null},
					function () { $('.verticalline').length > 0 ? $('.verticalline').css('height', $(window).height() - 75) : null},
					function () { $('.uniqueID').length > 0 ? menu.createSearchDivider($('.searchResultsSVG')) : null},
					function () { $('.searchSVG').length > 0 ? menu.createSearchIcon.call(this, $('.searchSVG')) : null},
					function () { return menu.fetchData.call(this, menu.uniqueIDField, menu.buildTable, menu.resubmitForm, menu.partial(menu.recursiveSwitch, null, menu.uniqueIDField, menu.adjustOffset))})

				$(window).on('resize', function (e) {
					var newWidth = +$(window).width()

					return helper.chainer(menu, null, null,
						function () { return animation.initiate.call(this)},
						function () { return menu.createSearchDivider($('.searchResultsSVG'))},
						function () { return newWidth > width ? menu.recursiveSwitch.call(this, true, menu.uniqueIDField, menu.adjustOffset) :
									  newWidth < width ? menu.recursiveSwitch.call(this, null, menu.uniqueIDField, menu.adjustOffset) : null})
				})

				$('.searchBtn').on('keypress', function(e) {
					return menu.addKeys.call(menu, $('.searchBtn').val())
				})

				$('.searchBtn').on('keyup', function(e) {
					$('.error').empty()
					return menu.keydownEvent.call(menu, e.which, menu.search, helper.partial.call(menu, menu.createSearchTerm, menu.createIcon))
				})
			})
		})
	})
})