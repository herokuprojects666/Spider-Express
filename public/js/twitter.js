require(['./requireConfig'], function () {
	require(['jquery'], function ($) {
		require(['helpers', 'underscore', 'tweets', 'animation'], function (helper, _, tweet, animation) {
			animation.initiate.call(this)
			var constructor = function () {
				this.bodyError = 'Error. Body field is empty'
				this.formError = '.invalidWidth'
				this.imageArea = '.imageDisplay'
				this.imageError = 'Error. Invalid Image Dimensions. Max aspect ratio is 2:1'
				this.imagePreview = '.tempImage'
				this.keystrokes = ''
				this.list = []
				this.prefixClasses = {'-u' : 'searchUser', '-h' : 'searchHashtag'}
				this.searchClasses = {'searchUser' : 'user', 'searchHashtag' : 'hashtags'}
				this.searchError = 'Error. Missing -u or -h prefix', '14px'
				this.searchPrefixes = ['-u', '-h']
				this.searchSVG = document.getElementById('searchSVG')
				this.searchTypes = ['hashtags', 'user']
				this.tempTweet = '.tempTweet'
				this.titleError = 'Error. Message Title is empty'
				this.twitterForm = '#twitterForm'
				this.tweetAnimationDuration = 1000
				this.tweetArea = '.container'
				this.tweetBody = '.bodyInput'
				this.tweetError = '.tweetError'
				this.tweetErrorMessage = 'Error. Missing fields on tweet form'
				this.tweetFormSVG = '.newTweetForm'
				this.tweetHashtags = '.hashtags'
				this.tweetImage = '.tweetImage'
				this.tweetMessageTitle = '.message_title'
				this.tweetPreview = '.tweetPreview'
				this.tweetFormSelectors = [$(this.twitterForm), $(this.imageArea), $(this.tweetPreview)]
				this.uniqueIDField = $('.uniqueID').attr('id')
			}
			// var importHelper = helper.addToProto(helper, tweet.construct)
			// var importTweet = helper.addToProto(tweet, tweet.construct)
			var menu = new tweet.construct(constructor)

			// new XMLSerializer().serializeToString()

			$(document).ready(function () {

				var width;
				var searchPhrase;
				var searchSVG = document.getElementById('searchSVG')
				$(this).on('mousemove', function (e){
					width = +$(window).width()
				})

				$('.tweetBtn').on('mousedown', function() {
					tweet.applyEffect.call(menu, menu.tweetSelectors.reverse(), true, 1, menu, function () {
						return helper.chainer(this, null, null,
							function () { $(this.tweetFormSVG).empty()},
							function () { return tweet.createTweetSVG.call(this, $(this.tweetFormSVG))},
							function () { return helper.hideElements(this.tweetFormSelectors)},
							function () { $(this.twitterForm).css('display', 'initial')},
							function () { return helper.removeElements([$(this.tempTweet), $(this.imagePreview)])},
							function () { return helper.resetFields([$(this.tweetMessageTitle), $(this.tweetBody), $(this.tweetHashtags),
								])})
					})
				})
				helper.chainer(menu, null, null,
					function () { $('.uniqueID').length > 0 ? tweet.createSearchDivider($('.searchResultsSVG')) : null},
					function () { $(this.searchSVG).length > 0 ? tweet.createSearchIcon.call(this, this.searchSVG, $('.searchSVG')) : null},
					function () { return tweet.fetchData.call(this, this.uniqueIDField, tweet.buildTable, tweet.resubmitForm, helper.partial.call(this, tweet.recursiveSwitch, null, this.uniqueIDField, tweet.adjustOffset))})

				$(window).on('resize', function (e) {
					var newWidth = +$(window).width()
					return helper.chainer(menu, null, null,
						function () { return animation.initiate.call(this)},
						function () { return tweet.createSearchDivider($('.searchResultsSVG'))},
						function () { return newWidth > width ? tweet.recursiveSwitch.call(this, true, this.uniqueIDField, tweet.adjustOffset) :
									  newWidth < width ? tweet.recursiveSwitch.call(this, null, this.uniqueIDField, tweet.adjustOffset) : null})
				})

				$('#chooseFile').on('click', function () {
					$('.imageFile').click()
				})

				$('.imageFile').on('change', function (e) {
					return tweet.grabFile.call(menu, e, this, tweet.displayImage)
				})

				$('.searchBtn').on('keypress', function(e) {
					return tweet.addKeys.call(menu, $('.searchBtn').val())
				})

				$('.searchBtn').on('keyup', function(e) {
					$('.error').empty()
					return tweet.keydownEvent.call(menu, e.which, tweet.search, helper.partial.call(menu, tweet.createSearchTerm, helper.partial.call(menu, tweet.createIcon, null)))
				})

				$('#submitTweet').on('click', function () {
					return tweet.submitTweet.call(menu)
				})

				$(menu.tweetBody).on('keyup', function () {
					$(menu.formError).empty()
					$(menu.tweetError).empty()
				})

				$(menu.tweetMessageTitle).on('keyup', function () {
					$(menu.formError).empty()
					$(menu.tweetError).empty()
				})
			})
		})
	})
})