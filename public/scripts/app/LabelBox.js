define(['jquery','Util'],function($,Util){

	var LabelBox = function(args){
		this.el = $(args.selector);
		this.textify = args.textify
	}


	var methods = {
		select:function(data){
			var d = data.d;
			console.log(this.el);
			this.el.val(this.textify(d)).select();
		}
	}

	return Util.constructClass(LabelBox,methods);
});