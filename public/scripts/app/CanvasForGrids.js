define(['underscore','backbone','d3', 'Canvas','Util','jquery'],function(_, Backbone, d3, Canvas, Util,$){

	function constructor(args){

	}

	var methods = {
		fillTitleInInitializeData: function(d){
			if(d.posPercent==null)
				return [d.identity,d.pval.toExponential(1),
				'null',d.count].join(', ');
			else
				return [d.identity,d.pval.toExponential(1),
				(d.posPercent-0.5).toFixed(2)].join(', ');
		},



		changeData:function(inputData){
			this.initializeData(inputData);
		},

		
	}

	return Util.inherit(Canvas,constructor,methods);

});