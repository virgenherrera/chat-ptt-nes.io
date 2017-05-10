"use strict";

const favicon 		= sys.require('serve-favicon');
const logger 		= sys.require('morgan');
// const cookieParser	= sys.require('cookie-parser');
const bodyParser 	= sys.require('body-parser');

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

	Application.prototype.getRoutes = function(){
		const routesConfig = sys.getConfig('/routes');
		let res = {};

		for(let key in routesConfig ){
			// find the router en routes dir then load it
			let routerFilePath = sys.path.join( sys.dir.routes ,  routesConfig[key] );
			let router = ( sys.fileExists( routerFilePath + '.js') ) ? sys.require( routerFilePath ) : false;

			// translate key as public style string for route
			let resKey = '/';
			resKey += ( key != 'default' ) ? key : '';

			// store it in Response Object
			res[ resKey ] = {
				name: key,
				path: routesConfig[key],
				router: router,
			};
		}

		return res;
	};

	Application.prototype.exposeRoutes = function(){
		const loadedRouters = this.getRoutes();

		for( let key in loadedRouters ){
			if( sys.env.env === 'development' ){
				if( loadedRouters[key].router )
				console.log('exposing router: "'+loadedRouters[key].path+'" as: "'+key+'"');
			}

			if( !loadedRouters[key].router ){
				console.error(' WARNING: The router named: "'+loadedRouters[key].name+'" does not exist in the path "'+loadedRouters[key].path+'" please check the file "/config/routes.js"');
			} else {
				this.express.use( key , loadedRouters[key].router );
			}
		}
	};

	Application.prototype.catch404 = function(){
		// catch 404 and handle it
		this.express.use(function(req, res, next) {
			const err = new Error('Not Found');
			err.status = 404;

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
