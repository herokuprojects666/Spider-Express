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
			// console.log(menu)
			// // menu.uniqueIDField
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
					if ($('.linebreak').length > 0)
						$('.linebreak').css('width', $(window).width() - 50)
					if ($('.verticalline').length > 0)
						$('.verticalline').css('height', $(window).height() - 75)
					if (newWidth > width) {
						console.log('here')
						return menu.recursiveSwitch.call(menu, true, menu.uniqueIDField, menu.adjustOffset)
					} else if (newWidth < width) {
						console.log('or here')
						return menu.recursiveSwitch.call(menu, null, menu.uniqueIDField, menu.adjustOffset)
					} else {
						null
					}
				})

				$(window).on('mouseup', function () {
					return animation.initiate.call(this)
				})

				$('.searchBtn').on('keypress', function(e) {
					return menu.addKeys.call(menu, $('.searchBtn').val())
				})

				// $('#testSVG').on('click', function () {
				// 	alert('mousedown')
				// })

				$('.searchBtn').on('keyup', function(e) {
					$('.error').empty()
					// menu.createSearchTerm()
					return menu.keydownEvent.call(menu, e.which, menu.search, helper.partial.call(menu, menu.createSearchTerm, menu.createIcon))
					// return e.which == 13 ? $.ajax({
					// 	url : '/home/' + $('.gameboard').attr('id').toLowerCase() + '/search/',
					// 	data : 'hashtags=' + item + '&user=' + item,
					// 	type : 'get',
					// 	success : function(data) {
					// 		sessionStorage.setItem(item, JSON.stringify(data))
					// 		$('.hashtags').val($('.searchBtn').val())
					// 		$('.user').val($('.searchBtn').val())
					// 		$('.submitting').submit()
					// 	}
					// }) : null
				})
			})
		})
	})
})