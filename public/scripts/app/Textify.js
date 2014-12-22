define(['jquery','Util','S','underscore'],function($,Util,S,_){

	// private variables. To be enlarged with more cases.
	var predefinedOrder = ['identity','pval','overlap','posPercent']
	var transform = {
		identity: function(identity){return  S(identity)
			.replaceAll('_',' ').replaceAll('-',' ').trim().s;},
		pval:function(pval){return pval.toExponential(1)},
		overlap:function(overlap){return overlap},
		posPercent:function(posPercent){return (posPercent-0.5).toFixed(2)}
	}


	var Textify = function(args){
		// keys of one term object
		var orderedKeys = ["identity"]
		predefinedOrder.forEach(function(e){
			if(_.contains(args.keys,e)){
				orderedKeys.push(e);
			}
		})
		return function(d){
			return _.map(orderedKeys,function(key){
				return transform[key](d[key]);
			}).join(', ');
		}
	}


	return Textify;
});