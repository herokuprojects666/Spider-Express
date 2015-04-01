var express = require('express')
	routes = require('./routes')
	path = require('path')
	mongoclient = require('mongodb').MongoClient
	_ = require('underscore')
	url = 'mongodb://localhost:27017/spider'
	uri = 'mongodb://craggoo:starcraft@ds039411.mongolab.com:39411/spider-express'
	mongoclient.connect(uri, function (err, db) {
		console.info('connected to db')
		collections = {
			users : db.collection('users'),
			spider : db.collection('spider'),
			highScores : db.collection('high_scores')

		}
	})
	cookies = require('cookie-parser')
	session = require('express-session')
	logger = require('morgan')
	errorHandler = require('errorhandler')	
	bodyParser = require('body-parser')
	crypto = require('crypto')
	process.env.PWD = process.cwd()


var app = express()
app.locals.appTitle = "Craggoo's app";

var authorized = function(req, res, next) {
	if (!req.session || !req.session.user) {
		return res.send(401);
	} else {
		return next();
	}
}

var encrypt = function (req, res, next) {
	if (req.body && req.body.password) {
		req.body.password = crypto.createHash('sha1').update(req.body.password).digest('hex')
		return next()
	} {
		return next()
	}
}

app.use( function (req, res, next) {
	if (!collections.users) return next(new error('no users found'))
	req.collections = collections
	return next()
})

app.set('port', process.env.PORT || 4000);
app.set('views', process.env.PWD + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookies('whatever'))
app.use(session({secret : 'abcdefghijk'}));
app.use(express.static(__dirname + '/public'));

app.get('/', routes.index)

app.post('/loadgame/:user', authorized, routes.game.loadgame)
app.get('/home/:user/logout', routes.game.logout)
app.get('/home/:user/spider', authorized, routes.game.spider)
app.post('/update/:user', authorized, routes.game.update)
app.post('/highScore/:user', authorized, routes.game.highScore)
app.get('/api/scores', authorized, routes.game.scores)
app.get('/home/:user/spider-rules', authorized, routes.game.rule)
app.post('/create', encrypt, routes.user.adduser)
app.post('/login', encrypt, routes.user.authenticate)
app.get('/guest', routes.user.guest)

app.get('/create', routes.user.create)
app.get('/home/:user', authorized, routes.user.home)
app.get('/login', routes.user.login)

app.listen(app.get('port'), function() {
	console.log('app listening on ' + app.get('port'))
});

