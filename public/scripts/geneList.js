requirejs.config({

baseUrl: 'scripts/app',

paths: {
	underscore: "../lib/underscore-min",
	backbone: "../lib/backbone-min",
	d3: "../lib/d3.min",
	"jquery-base": "../lib/jquery-1.8.2.min",
	math: "../lib/math.min",
	Util:"../lib/Util",
	S:"../lib/string.min",
	"jquery":"../lib/jquery-ui-tooltip-customized"
},

shim:{

	'backbone':{
		deps:['underscore','jquery-base'],
		exports: 'Backbone'
	},

	'underscore':{
		exports:'_'
	},

	'jquery':{
		exports:'$',
		deps:['jquery-base']
	},

	'd3':{
		exports:'d3'
	},

	'math':{
		exports:'math'
	},


}

});



require([],function(){
	
});


