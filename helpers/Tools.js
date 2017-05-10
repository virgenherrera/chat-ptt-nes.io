'use strict';

const path 		= require('path');
const express 	= require('express');
const fs 		= require('fs');
const SocketIo	= require('socket.io');

const Tools = (function(){
	function Tools(){
		// declare parent directory as basePath
		process.chdir( path.join( __dirname , '../' ) );

		const baseDir = process.cwd();

		//project directories list
		this.dir = {
			base: 			baseDir,
			config: 		baseDir + "/config",
			models: 		baseDir + "/models",
			routes: 		baseDir + "/routes",
			public: 		baseDir + "/public",
			views: 			baseDir + "/views",
			controllers: 	baseDir + "/controllers",
		};

		// Environment vars
		this.env = this.getConfig('/env');
	}

	/*
	 * System Loaders
	 */
	Tools.prototype.require = function(Module){
		if( Module && typeof Module === 'string' ){
			let	modOrOPack		= ( Module.charAt(0) === "/" );
			let	requireString	= modOrOPack ? this.path.join( this.dir.base , Module ) : Module;

			return require( requireString );

		} else {
			console.error('error trying to load module, module must be a STRING and you used:');
			this.dd( Module );
		}
	};

	// Config Loader
	Tools.prototype.getConfig = function(configFile){
		const configFilePath = this.path.join( this.dir.config + configFile );

		return this.require( configFilePath );
	};

	// Databse Config for Environment
	Tools.prototype.getDbConfig = function(){
		// get the database config
		const dbCfg = this.getConfig('/db');

		// return db config accordint ot env
		return dbCfg[ this.env.env ];
	};

	Tools.prototype.fileExists = function(pathTofile){
		return ( fs.existsSync( pathTofile ) );
	};

	Tools.prototype.fileExistsRel = function(filePath){
		return this.fileExists( this.dir.base + filePath );
	};

	Tools.prototype.getProjectUrl = function(){
		return this.env.host + ":" + this.env.port;
	};

	Tools.prototype.dump = function(){
		console.log("\n//*------- start Data dumping...\n");
		for ( var arg in arguments ){
		    // Notify about which arg are dumping
		    console.info('\n\n\t...for argument:{'+arg+"}\n");
		    //print type
		    console.log( 'Type: ', typeof arguments[arg] );
		    // print length if exists
		    if( arguments[arg] && arguments[arg].length ){
		        console.log( 'Legth: ', arguments[arg].length );
		    }
		    // print Value
		    if( typeof arguments[arg] === "string" || /^\d+$/.test( arguments[arg] ) ){
		        console.log( 'Value: ', arguments[ arg ] );
		    } else {
		        console.log( 'Value: ');
		        console.dir( arguments[ arg ] );
		    }
		}
		console.log("\n\t\tData dump done! -------*//\n");
	};

	Tools.prototype.die = function(){
		console.trace();
		console.info("\n\n\nnow Process will die\n\n");
		process.exit();
	};

	Tools.prototype.dd = function(){
		this.dump.apply( this, arguments );
		this.die();
	};

	/**
	 *	Additional Tools to prevent require Inception
	 * 	path for directory tasks
	 *	Express for use it in app and routers
	 *	Socket.io for realtime I/O
	 */
	Tools.prototype.path = path;
	Tools.prototype.express = express;
	Tools.prototype.io = SocketIo

	return Tools;
})();

global.sys = new Tools();
