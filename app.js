var express = require('express')
	cloudinary = require('cloudinary')
	multer = require('multer')
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
			highScores : db.collection('high_scores'),
			snake : db.collection('snake'),
			tweets : db.collection('tweets')
		}
	})
	cookies = require('cookie-parser')
	session = require('express-session')
	logger = require('morgan')
	errorHandler = require('errorhandler')
	bodyParser = require('body-parser')
	crypto = require('crypto')
	// process.env.PWD = process.cwd()


var app = express()
app.locals.appTitle = "Craggoo's app";

cloudinary.config({
	cloud_name : 'craggoo',
	api_key: '139664333263128',
	api_secret : 'ccicwuz-b_rQkM_T78hriNCZZQo'
})

app.use(function (req, res, next) {
	if (process.env.node_env == 'development') {
		app.use(errorHandler())
		return next();
	}
})

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

var upload = function(req, res, next) {
	cloudinary.uploader.upload(req.files.path, function(result) {
	})
}

var images = function(req, res, next) {
	cloudinary.api.resources(function(result) {
		req.images = result.resources
		return next()
	})
}

var addImageURL = function(req, res, next) {
	var list = _.each(req.tweets, function (ele, index) {
		var images = _.map(ele.images, function (elem) {
			return _.reduce(req.images, function (memo, e) {
				return e.public_id == elem ? memo += e.url : memo
			}, '')
		})
		req.tweets[index].image_urls = images
	})
	return next()
}

app.use( function (req, res, next) {
	req.collections = collections
	return next()
})

app.use(multer({ dest : './temp'}))
app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookies('whatever'))
app.use(session({secret : 'abcdefghijk'}));
app.use(express.static(__dirname + '/public'));


app.get('/', routes.index)
app.get('/:user/tweets', images, routes.user.tweets, routes.user.searchPage)
app.get('/home/search', routes.user.searchPage)
app.get('/home/:user/search', images, routes.user.search, addImageURL, routes.user.tweetData)
app.get('/home/:user/newTweet', routes.user.newTweet)
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
app.get('/home/:user/snake', routes.game.snake)
app.get('/home/:user/snake-rules', routes.game.snakeRules)
app.get('/home/:user/profile', routes.user.profile)
app.get('/home/:user/tweetData', images, routes.user.tweets, addImageURL, routes.user.tweetData)

app.get('/create', routes.user.create)
app.get('/home/:user', authorized, images, routes.user.tweets, routes.user.home)
app.get('/login', routes.user.login)



app.listen(app.get('port'), function() {
	console.log('app listening on ' + app.get('port'))
});

