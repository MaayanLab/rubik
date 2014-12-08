define(['jquery','Util','S'],function($,Util,S){

	var LabelBox = function(args){
		this.el = $(args.selector);
	}

	var methods = {
		select:function(data){
			var d = data.d;

			var identity = S(d.identity).replaceAll('_',' ').replaceAll('-',' ').trim().s;
			if(d.posPercent==null){
				var label =  [identity,d.pval.toExponential(1),
				'null'].join(', ');
			}else{
				var label = [identity,d.pval.toExponential(1),
				(d.posPercent-0.5).toFixed(2)].join(', ');
			}
			label = 
			this.el.val(label).select();
		}
	}

	return Util.constructClass(LabelBox,methods);
});