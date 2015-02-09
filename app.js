var express = require('express')
	routes = require('./routes')
	path = require('path')
	mongoclient = require('mongodb').MongoClient
	url = 'mongodb://localhost:27017/spider'
	uri = 'mongodb://craggoo:starcraft@ds039411.mongolab.com:39411/spider-express'
	mongoclient.connect(uri, function (err, db) {
		console.info('connected to db')
		collections = {
			users : db.collection('users'),
			spider : db.collection('spider')
		}
	})
	cookies = require('cookie-parser')
	session = require('express-session')
	logger = require('morgan')
	errorHandler = require('errorhandler')	
	bodyParser = require('body-parser')
	


var app = express()
app.locals.appTitle = "Craggoo's app";

var authorized = function(req, res, next) {
	if (!req.session || !req.session.user) {
		// console.log(req.session)
		// console.log(req.session.user)
		return res.send(401);
	} else {
		return next();
	}
}
app.use( function (req, res, next) {
	if (!collections.users) return next(new error('no users found'))
	req.collections = collections
	return next()
})
app.set('port', 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookies('whatever'))
app.use(session({secret : 'abcdefghijk'}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/jasmine', routes.user.jasmine)
app.get('/index', routes.index)
app.get('/login', routes.user.login)
app.get('/create', routes.user.create)
app.post('/create', routes.user.adduser)
app.post('/login', routes.user.authenticate)
app.post('/update/:user', routes.user.update)
app.post('/loadgame/:user', routes.user.loadgame)
app.get('/home/:user', authorized, routes.user.home)
app.get('/home/:user/spider', authorized, routes.user.spider)

app.listen(app.get('port'), function() {
	console.log('app listening on ' + app.get('port'))
});
