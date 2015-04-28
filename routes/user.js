var _ = require('underscore')
		path = require('path')

exports.adduser = function(req, res, next) {
	req.collections.users.findOne({
		email : req.body.email
	}, function (err, user) {
		if (user) return res.render('create', {error : 'Email is already registered to an account'})
		req.collections.users.insert({
			email : req.body.email,
			password : req.body.password,
			username : req.body.username
		}, function (err, user) {
			res.render('accountcreate')
		})
	})
}

exports.authenticate = function(req, res, next) {
	req.collections.users.findOne({
		email : req.body.email,
		password : req.body.password
	}, function (err, user) {

		if(err) return next(err)
		if (!user) return res.render('login', {error: 'Incorrect email/password combo'})

		req.session.user = user
		res.redirect('/home/' + user.username)
	})
}

exports.create = function(req, res, next) {
	res.render('create')
}

exports.guest = function(req, res, next) {
	var number = Math.floor(100 * Math.random())
	req.collections.users.insert({
		email : 'guest' + number + '@gmail.com',
		password : 'temp',
		username : 'guest' + number
	}, function (err, user) {
		req.session.user = user
		req.number = number
		return res.redirect('/home/guest' + req.number)
	})
}

exports.home = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		user.tweets = req.tweets
		res.render('home', {user : user})
	})
}

exports.login = function(req, res, next) {
	res.render('login')
}

exports.profile = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		res.render('profile', {user : user})
	})
}

exports.search = function(req, res, next) {
	req.collections.tweets.find({ $or : [{hashtags : req.query.hashtags}, {created_by : req.query.user}]}).toArray(function (err, user) {
		req.session.tweet = {}
		req.session.tweet.tweets = user
		res.send({user : req.session.tweet})
	})
}

exports.searchPage = function(req, res, next) {
	var user = {'username' : req.session.user.username, 'hashtag' : req.query.hashtags}
	res.render('search', {user : user})
}

exports.tweetData = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		var list = _.each(req.tweets, function (ele, index) {
			var images = _.map(ele.images, function (elem) {
				return _.reduce(req.images, function (memo, e) {
					return e.public_id == elem ? memo += e.url : memo
				}, '')
			})
			req.tweets[index].image_urls = images
			user.tweets = req.tweets
			user.tweets[index].image_urls = images
		})
		res.send({user : user})
	})
}

exports.tweets = function(req, res, next) {
	req.collections.tweets.find({
		created_by : req.params.user
	}).toArray(function (err, user) {
		req.tweets = user
		return next()
	})
}

exports.upload = function(req, res, next) {
	req.files.path = path.normalize(req.files.displayImage.path)
	return next()
}

var urlPath = function(image) {
	return cloudinary.api.resource(image, function (img) {
		return img.url
	})
}