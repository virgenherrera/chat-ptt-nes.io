'use strict';

const path = require('path');
const fs = require('fs');

var Tools = (function(){
	function Tools(){
		// declare parent directory as basePath
		process.chdir( path.join( __dirname , '../' ) );

		// property to expose
		this.tools = {
			dir: { base: process.cwd() },
			path: path,
		};

		return this.constructor();
	}

	Tools.prototype.constructor = function(){


		// load paths, environment , debugtools
		this.declarePaths().getEnv().getDbConfig().exposeDD().exposeFileExists();

		// push loadSystemModule to tools
		this.tools.require = this.loadSystemModule;

		// expose tools to global Scope
		global.sys = this.tools;
	};

	Tools.prototype.loadSystemModule = function(projModule){
		if( projModule.charAt(0) !== "/" ) throw "Module must begin with '/'";

		let pathToModule = path.join( process.cwd() , projModule );

		return require( pathToModule );
	};

	Tools.prototype.getEnv = function(){
		// get the env
		const env = this.loadSystemModule('/config/env');
		// push it to tools
		this.tools.env = env;

		return this;
	};

	Tools.prototype.getDbConfig = function(){
		// get the database config
		const dbCfg = this.loadSystemModule('/config/db');
		// push it to tools as a function
		this.tools.getDbConfig = ()=>dbCfg[ this.tools.env.env ];

		return this;
	};

	Tools.prototype.declarePaths = function(){
		const systemPaths = [
		'views',
		'public',
		'routes',
		'models',
		'config',
		'controllers',
		];


		// declare additional paths
		for (var i = systemPaths.length - 1; i >= 0; i--) {
			// systemPaths[i]
			this.tools.dir[ systemPaths[i] ] = path.join( this.tools.dir.base , systemPaths[i] );
		}

		return this;
	};

	Tools.prototype.dump = function(){
		console.log('\x1Bc');
		console.log(`\n\t\tstart Data dumping...\n`);
		for ( let data in arguments ){
			// statement
			if( typeof arguments[data] === "string" || /^\d+$/.test( arguments[data] ) ){
				console.log( arguments[ data ] );
			} else {
				console.dir( arguments[ data ] );
			}
		}
		console.log(`\n\t\t...data dump done!\n`);
	};

	Tools.prototype.die = function(){
		console.info(`now Process will die`);
		process.exit();
	};

	Tools.prototype.dumpAndDie = function(){
		this.dump.apply( this, arguments );
		this.die();
	};

	Tools.prototype.exposeDD = function(){
		if( this.tools.env.env === 'development' ){
			this.tools.dump = this.dump;
			this.tools.die = this.die;
			this.tools.dd = this.dumpAndDie;
		}
		return this;
	};

	Tools.prototype.exposeFileExists = function(){
		this.tools.fileExists = (pathTofile)=>{ ( fs.existsSync( pathTofile ) ) };
		return this;
	};

	return Tools;
})();

module.exports = new Tools();
