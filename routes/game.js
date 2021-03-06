var _ = require('underscore')

exports.highScore = function(req, res, next) {
	req.collections.highScores.findAndModify({
		username : req.body.username,
		score : req.body.score,
		difficulty: req.body.difficulty
	}, [['username', -1]], 
	{$set : {'score' : req.body.score}},
	{new:true, upsert:true}, function (err, user) {
		return res.send('score submitted')
	})
}

exports.loadgame = function(req, res, next) {
	if (req.body.slot >= 10) {
		return res.send({error : 'Invalid Value'})
	}
	req.collections.spider.findOne({
		username : req.params.user,
		slot : req.body.slot
	}, function (err, user) {
		if(_.isEmpty(user)) return res.send({error : 'No Game Found'})
		return res.send({game : user.game})
	})
}


exports.logout = function(req, res, next) {
	return req.session.destroy(function (err) {
		if (err) {
			return next(new Error('failed to logout'))
		}
		if (/(guest)/.test(req.params.user)) {
			console.info('here')
			console.info(req.params.user)
			return req.collections.users.remove({
				username : req.params.user
			}, function (err, user) {
				return res.redirect('/')
			})
		}
		return res.redirect('/')
	})
}

exports.rule = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		res.render('spider-rules', {user : user})
	})
}

exports.scores  = function (req, res, next) {
	req.collections.highScores.find().toArray(function (err, scores) {
		return res.send({scores : scores})
	})
}

exports.snake = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		res.render('snake', {user : user})
	})
}

exports.snakeRules = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		res.render('snake-rules', {user : user})
	})
}

exports.spider = function(req, res, next) {
	req.collections.users.findOne({
		username : req.params.user
	}, function (err, user) {
		res.render('spider', {user : user})
	})
}

exports.update = function(req, res, next) {
	req.collections.spider.findOne({
		username : req.params.user,
		slot : req.body.slot
	}, function (err, user) {
		if(_.isEmpty(user)) 
			return req.collections.spider.insert({
			username : req.params.user,
			slot : req.body.slot,
			game : req.body.game
		}, function (err, user) {
			res.send({status : 'created new game for user'})
		})
		return req.collections.spider.findAndModify(
			{username : req.params.user, slot : req.body.slot},
			[['username', -1]],
			{$set : {'game' : req.body.game}},
			{new:true}, 
				function (err, user) {
				res.send({game : user.game})
		})
	})
}