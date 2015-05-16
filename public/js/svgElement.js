require(['./requireConfig'], function () {
    require(['jquery'], function ($) {
        require(['helpers', 'underscore', 'animation'], function (helper, _, animation) {
            animation.initiate.call(this)
            $(document).ready(function () {

                $(window).on('resize', function () {
                    animation.initiate.call(this)
                })
            })
        })
    })
})