'use strict';

const path 		= require('path');
const express 	= require('express');
const fs 		= require('fs');
const socketIo 	= require('socket.io');

const Tools = (function(){
	function Tools(){
		// declare parent directory as basePath
		process.chdir( path.join( __dirname , '../' ) );

		const baseDir = process.cwd();

		//project directories list
		this.dir = {
			base: 			baseDir,
			config: 		this.path.join( baseDir , "/config" ),
			models: 		this.path.join( baseDir , "/models" ),
			routes: 		this.path.join( baseDir , "/routes" ),
			public: 		this.path.join( baseDir , "/public" ),
			views: 			this.path.join( baseDir , "/views" ),
			controllers: 	this.path.join( baseDir , "/controllers" ),
		};

		// Environment vars
		this.env = this.require('/config/env');
	}

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

	Tools.prototype.getDbConfig = function(){
		// get the database config
		const dbCfg = this.require('/config/db');

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
	 *	Additional tools to avoid require inception
	 */

	// path for directory jobs
	Tools.prototype.path = path;
	// express for use it in app and routers
	Tools.prototype.express = express;
	// socket.io for realtime I/O between this service and clients
	Tools.prototype.io = socketIo;

	return Tools;
})();

global.sys = new Tools();
