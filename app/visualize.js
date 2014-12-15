var fs = require('fs');
var us = require('underscore');
var async = require('async');
var jade = require('jade');
var natural = require('natural');


var compareTemplateFn = jade.compileFile('public/views/compare.jade',{pretty:true});

var baseURL = 'http://10.91.53.79:8080/rubik/';


var libraryNameToGridName = {'ChEA2':'ChEA','KEGG_pathways':'KEGG_new',
'WikiPathways_pathways':'WikiPathways','GeneOntology_BP':'GO_Biological_Process',
'GeneOntology_MF':'GO_Molecular_Function','MGI_MP_top4':'MGI_Mammalian_Phenotype_Level_4',
'ENCODE_TF_ChIP-seq_fuzzy':'ENCODE_TF_ChIP-seq',
'L1000_Kinase_Perturbations':'Kinase_Perturbations_from_L1000',
'KinasePerturbationsGEO_ChDir_37kinases_94perturbations':'Kinase_Perturbations_from_GEO',
'KEA':'KEA'};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

var average = function(arr){
	var arr = us.filter(arr,function(val){
		return isNumeric(val);
	});
	if(arr.length > 0)
		return us.reduce(arr,function(memo,num){return memo+num;},0)/arr.length;
	else
		return null;
}


var averageDuplicateTerms = function(termsArr){
	// average term that occur multiple times in a library and convert
	// termsArr to a library dictionary for hash access.

	// numeric, averagable attributes in a term object like pval, score, etc.
	var attrs  = us.filter(Object.keys(termsArr[0]),function(attr){
		return attr!="term";
	});

	var library = {};
	termsArr.forEach(function(e){
		if(e.term in library){
			attrs.forEach(function(attr){
				library[e.term][attr].push(e[attr]);
			});
		}
		else{
			library[e.term] = {};
			attrs.forEach(function(attr){
				library[e.term][attr] = [e[attr]];
			});
		}
	});
	
	for(key in library){
		attrs.forEach(function(attr){
			library[key][attr] = average(library[key][attr])
		});
	}

	return library;
}

var mostSimilar = function(terms,term){
	var mostSimilarTerm = us.max(terms,
		function(item){return natural.JaroWinklerDistance(item,term)});
	var similarity = natural.JaroWinklerDistance(mostSimilarTerm,term);
	if(similarity>=0.9){
		console.log(mostSimilarTerm+'<----->'+term);
		return mostSimilarTerm;
	}else{
		console.log(mostSimilarTerm,' similarity:',similarity);
		var error = new Error("no similar term found");
		throw error;
	}
}



exports.visualize = function(enrichRes,res){
	// enrichRes Structure:
	// enrichRes --- [perRes]
	// 		  		--- tag
	// 		  		--- data
	// 		  			---- libraryName1
	// 		 					---- [term]
	// 		 							--- term
	// 		 							--- pval 

	var tags = us.map(enrichRes,function(perRes){return perRes.tag});
	var gridNames = us.map(Object.keys(enrichRes[0]['data']),
		function(libraryName){return libraryNameToGridName[libraryName];});
	var readGridsTasks ={};
	gridNames.forEach(function(gridName){
		readGridsTasks[gridName] = function(callback){
			fs.readFile('public/jsonGrids/'+gridName+'.json',function(err,data){
				callback(err,JSON.parse(data.toString()));	
			});
		}
	});

	async.parallel(readGridsTasks,function(err,grids){
		var enrichments = [];
		var canvases = {}; // an alternative name for grid
		tags.forEach(function(tag,i){
			var enrichResult = enrichRes[i]['data'];
			var enrichment = {};
			for(var libraryName in enrichResult){
				var gridName = libraryNameToGridName[libraryName];
				var libraryResult = enrichResult[libraryName];
				var libraryResult = averageDuplicateTerms(libraryResult);
				
				// libraryResult struecture: {term:{pval,pospercent,count}}
				enrichment[gridName] = libraryResult;
				
				// make use of the side effect of for loop to normalize term name in grid.
				if(i==0){
					var grid = grids[gridName];
					var canvas = [];
					grid.forEach(function(e,j){
						var tile = {};
						tile.identity = e[0];
						tile.fitness = e[1];
						tile.idx = j;
						if(!libraryResult[tile.identity]){
							console.log('find similar term:',gmtName,tile.identity);
							tile.identity = mostSimilar(Object.keys(library),tile.identity);
						}
						canvas.push(tile);
					});
					canvases[gridName] = canvas;
				}
			}

			enrichments.push(enrichment);
		}); // tags.forEach

		var randStr = Math.random().toString(36).substring(7);
		var filename = 'rubik_'+randStr+'.html';
		fs.writeFile('public/'+filename,
			compareTemplateFn({tags:tags,enrichments:enrichments,grids:canvases}),
			function(err,results){
				if(err) throw err;
				res.send(baseURL+filename);	
		});
	}); // async.parallel
}