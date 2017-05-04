"use strict";

/* Index Router Class */
const usersRouter = (function(){
	function usersRouter(){
		// Router to Expose
		this.router = sys.express.Router();

		return this.constructor();
	}

	usersRouter.prototype.constructor = function(){
		this.router.get('/',this.rootGet);
	};

	/* GET home page. */
	usersRouter.prototype.rootGet = function(req,res,next){
		return res.send('respond with a resource');
	};

	return usersRouter;
})();

module.exports = new usersRouter().router;
