var _ = require('underscore')

exports.jasmine = function(req, res, next) {
	res.render('SpecRunner')
}


exports.loadgame = function(req, res, next) {
	if (req.body.slot > 10) {
		return res.send({error : 'Maximum game slots reached.'})
	}
	req.collections.spider.findOne({
		username : req.params.user,
		slot : req.body.slot
	}, function (err, user) {
		if(_.isEmpty(user)) return res.send({error : 'no game found'})
		return res.send({game : user.game})
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
