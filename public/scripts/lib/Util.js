define(['underscore','backbone'],function(_, Backbone){


	var Util = {};
		
	Util.constructClass = function(constructor,methods){
		_.extend(methods,Backbone.Events);
		_.extend(constructor.prototype,methods);

		return constructor;
	}

	Util.inherit = function(superConstructor,constructor,methods){
		function inheritedConstructor(args){
			superConstructor.call(this,args);
			constructor.call(this,args);

		}
		_.extend(inheritedConstructor.prototype,superConstructor.prototype);
		methods.super = superConstructor.prototype;
		_.extend(inheritedConstructor.prototype,methods);

		return inheritedConstructor;
	}
	

	return Util;


});