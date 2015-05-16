var _ = require('underscore'),
		path = require('path'),
		fs = require('fs'),
		requirejs = require('requirejs')
		cloudinary = require('cloudinary')

requirejs.config({
	baseUrl : 'public/js',
	paths : {
		helpers : './helpers'
	}
})

var helpers = requirejs('helpers')

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
		req.session.user = _.first(user)
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

exports.insertTweet = function(req, res, next) {
	req.collections.tweets.insert({
		created_by : req.tweetDetails.createdBy,
		message_body : req.tweetDetails.body,
		message_title : req.tweetDetails.messageTitle,
		images : [req.tweetDetails.image.fileName.split('.')[0]],
		hashtags : req.tweetDetails.hashtags.split(','),
		image_urls : [req.tweetDetails.image.url],
	}, function (err, doc) {
		return next()
	})
}

exports.login = function(req, res, next) {
	res.render('login')
}

exports.newTweet = function (req, res, next) {
	var user = {username : req.params.user}
	res.render('tweet', {user : user})
}

exports.profile = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		res.render('profile', {user : user})
	})
}

exports.receiveTweet = function(req, res, next) {
	var filepath = 'temp/' + req.body.fileName
	var image = new Buffer(req.body.image, 'base64')
	fs.writeFile(filepath, image, 'base64', function (err) {
		var messageTitle = helpers.createObject('messageTitle', req.body.messageTitle)
		var body = helpers.createObject('body', req.body.messageBody)
		var hashtags = helpers.createObject('hashtags', req.body.hashtags)
		var path = helpers.createObject('path', filepath)
		var createdBy = helpers.createObject('createdBy', req.params.user)
		req.tweetDetails = helpers.mergeObjects([messageTitle, body, hashtags, path, createdBy])
		return next()
	})
}

exports.removeFile = function(req, res, next) {
	fs.unlink(req.tweetDetails.path)
}

exports.scaleImage = function(req, res, next) {
	var url = cloudinary.image(req.tweetDetails.image.fileName, {width : 200, crop : 'scale'})
	var src = url.split(/\s+/g)
	var imageURL = src[1].split("'")[1]
	_.extend(req.tweetDetails.image, {'url' : imageURL})
	return next()
}

exports.search = function(req, res, next) {
	if (_.isEmpty(req.query.user) && _.isEmpty(req.query.hashtags))
		return req.collections.tweets.find({}).toArray(function(err, user) {
			req.tweets = user
			return next()
		})
	var user = req.query.user.split(',')
	var hashtags = req.query.hashtags.split(',')
	req.collections.tweets.find({ $or : [ {created_by : {$in : user} }, {hashtags : {$in : hashtags} }]}).toArray(function (err, user) {
		req.tweets = user
		return next()
	})
}

exports.searchPage = function(req, res, next) {
	var hashtags = _.isArray(req.query.hashtags) ? req.query.hashtags.join(' ') : req.query.hashtags
	var user = _.isArray(req.query.user) ? req.query.user.join(' ') : req.query.user
	var user = {'username' : req.session.user.username, 'id' : req.query.id, 'user' : user, 'hashtags' : hashtags}
	res.render('search', {user : user})
}

exports.tweetData = function(req, res, next) {
	var user = {}
	user.tweets = req.tweets
	res.send({user : user})
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
	cloudinary.uploader.upload(req.tweetDetails.path, function(result) {
		var width = helpers.createObject('width', result.width)
		var height = helpers.createObject('height', result.height)
		var fileName = helpers.createObject('fileName', result.public_id + '.' + result.format)
		_.extend(req.tweetDetails, {'image' : helpers.mergeObjects([width, height, fileName])})
		return next()
	})
}

var urlPath = function(image) {
	return cloudinary.api.resource(image, function (img) {
		return img.url
	})
}