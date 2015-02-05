exports.index = function(req, res, next) {
	res.render('index')
}

exports.user = require('./user');
exports.game = require('./game');