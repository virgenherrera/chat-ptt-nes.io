"use strict";

const favicon 		= sys.require('serve-favicon');
const logger 		= sys.require('morgan');
// const cookieParser	= sys.require('cookie-parser');
const bodyParser 	= sys.require('body-parser');
const index 		= sys.require('/routes/index');
const users 		= sys.require('/routes/users');

// Create and config a new ExpressJs web Application
var Application = (function(){
	function Application(){
		this.express = sys.express();

		return this.constructor();
	}

	Application.prototype.constructor = function() {
		this.middleware();
		this.viewsConfig();
		this.exposePubicPath();
		this.exposeRoutes();
		this.catch404();
	};

	Application.prototype.middleware = function(){
		this.express.use( favicon( sys.path.join( sys.dir.public, 'favicon.ico') ) );
		this.express.use(logger('dev'));
		this.express.use( bodyParser.json() );
		this.express.use( bodyParser.urlencoded({ extended: true }) );
		// this.express.use( cookieParser() );
	};

	Application.prototype.viewsConfig = function(){
		// view engine setup
		this.express.set('views', sys.dir.views);
		this.express.set('view engine', 'pug');
	};

	Application.prototype.exposePubicPath = function(){
		this.express.use( sys.express.static( sys.dir.public ) );
	};

	Application.prototype.loadRoutes = function(){
		return {
			"/": 		sys.require('/routes/index'),
			"/users": 	sys.require('/routes/users'),
		};
	};

	Application.prototype.exposeRoutes = function(){
		const exposedRouters = this.loadRoutes();

		for( let key in exposedRouters ){
			console.log("exposing route: "+key);
			this.express.use( key , exposedRouters[ key ] );
		}
	};

	Application.prototype.catch404 = function(){
		// catch 404 and forward to error handler
		this.express.use(function(req, res, next) {
		  const err = new Error('Not Found');
		  err.status = 404;
		  next(err);
		});

		// error handler
		this.express.use(function(err, req, res, next) {
		  // set locals, only providing error in development
		  res.locals.message = err.message;
		  res.locals.error = req.app.get('env') === 'development' ? err : {};

		  // render the error page
		  res.status(err.status || 500);
		  res.render('error');
		});
	};

	return Application;
})();

const App = new Application();

module.exports = App.express;
