require(['./requireConfig'], function () {
	require(['jquery'], function ($) {
		require(['layout'], function () {
			console.log('done with loading')
		})
	})
})