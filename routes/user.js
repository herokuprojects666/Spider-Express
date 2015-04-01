var _ = require('underscore')

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
		console.info(req.session.user)
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
		res.render('home', {user : user})
	})
}

exports.login = function(req, res, next) {
	

	res.render('login')
}