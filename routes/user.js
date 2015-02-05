var _ = require('underscore')

exports.login = function(req, res, next) {
	res.render('login')
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

exports.home = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		res.render('home', {user : user})
	})
}

exports.spider = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		res.render('spider', {user : user})
	})
}

exports.create = function(req, res, next) {
	res.render('create')
}

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

exports.update = function(req, res, next) {
	req.collections.spider.findOne({
		username : req.params.user
	}, function (err, user) {
		if(_.isEmpty(user)) 
			return req.collections.spider.insert({
			username : req.params.user,
			game : req.body.game
		}, function (err, user) {
			res.send({status : 'created new game for user'})
		})
		return req.collections.spider.findAndModify(
			{username : req.params.user},
			[['username', -1]],
			{$set : {'game' : req.body.game}},
			{new:true}, 
				function (err, user) {
				res.send({game : user.game})
				// res.send({status : 'updated successfully'})
		})
	})
}

exports.loadgame = function(req, res, next) {
	req.collections.spider.findOne({
		username : req.params.user
	}, function (err, user){
		if(_.isEmpty(user)) return res.send({error : 'no game found'})
		return res.send({game : user.game})
	})
}

exports.jasmine = function(req, res, next) {
	res.render('SpecRunner')
}