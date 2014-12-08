define(['jquery','Util','S'],function($,Util,S){

	var Input = function(args){
		this.el = $(args.selector);
	}

	var methods = {

		isEmpty = function(){
			if(this.el.val==?) return true;
			else return false;
		},
		val = function(){
			return this.el.val()
		},

	}

	return Util.constructClass(Input,methods);
});