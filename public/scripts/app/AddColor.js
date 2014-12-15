define(['underscore','backbone','d3','math'],function(_, Backbone, d3,math){


function AddColor(args){
	// this class add color to the input data and transform it to generic canvas input format.

	// bright colors picked from d3.scale.categroyxx
	//                    orange     red        blue     pink       green     purple  grassyellow
	var brightColors = ['#ff7f0e','#ff9896', '#17becf', '#e377c2',  '#98df8a','#9467bd','#dbdb8d'];

	var colorMap = {};
	args.gridNames.forEach(function(e,i){
		var idx = i%brightColors.length;
		colorMap[e] = brightColors[idx];
	});
	this.colorMap = colorMap;

}


//private functions
var getNonInfiniteWeights = function(pvals,logBase){
	// if pval == 0, the socre will be infinite
	var sortedPvals = _.sortBy(pvals,_.identity);
	var i=0;
	while(sortedPvals[i]==0){
		i++;
	}
	var getScore = function(pval){
		return -math.log(pval,logBase)
	}

	var maxScore = getScore(sortedPvals[i])+getScore(sortedPvals[i])-
					getScore(sortedPvals[i+1]);
	
	var weights = [];
	pvals.forEach(function(e){
		if(e==0) weights.push(maxScore);
		else weights.push(getScore(e));
	})
	return weights;
}

    
var addColorMethods = {
	// for raw grid data, basically an array of [identity, fitness].
	addRaw: function(gridName,gridData){
		var color = this.colorMap[gridName];
		var scaleExponent = 3;
		var weights = _.map(gridData,function(d){return d[1]});
		var colorScale = d3.scale.pow().exponent(scaleExponent)
						.domain([_.min(weights),_.max(weights)])
						.range(["black",color]);

		console.log(gridName,_.min(weights),_.max(weights));

		var res = [];
		gridData.forEach(function(e,i){
			var tile = {};
			tile.identity = e[0];
			tile.idx = i;
			tile.color = colorScale(e[1]);
			res.push(tile);
		});
		return res;
	},

	add: function(gridName,gridData){
		var color = this.colorMap[gridName];
		var scaleExponent = 2;
		// var weights = _.map(gridData,function(d){return -math.log(d.pval,2)});
		var pvals = _.map(gridData,function(d){return d.pval});
		var weights = getNonInfiniteWeights(pvals,2);
		var colorScale = d3.scale.pow().exponent(scaleExponent)
						.domain([_.min(weights),_.max(weights)])
						.range(["black",color]);

		// console.log(gridName,_.min(weights),_.max(weights));

		var res = [];
		gridData.forEach(function(e,i){
			e.color = colorScale(weights[i]);
			res.push(e);
		});
		return res;

	},
}


_.extend(addColorMethods,Backbone.Events);
_.extend(AddColor.prototype,addColorMethods);


return AddColor;


});