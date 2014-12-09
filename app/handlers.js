var fs = require('fs');
var us = require('underscore');
// var packer = require('zip-stream');
var archiver = require('archiver');
var jade = require('jade');

var enrichRes2grids = require('app/enrichRes2grids.js')

// template:
var templateFn = jade.compileFile('public/views/grids.jade',{pretty:true});
// standalone template for exploring
var exploreTemplateFn = jade.compileFile('public/views/explore.jade',{pretty:true});
var compareTemplateFn = jade.compileFile('public/views/compare.jade',{pretty:true});

var baseURL = 'http://10.91.53.79:8080/grids/';


exports.gridNames = function(req,res){

	var path = 'public/visualizeGrids/';
	files = []
	fs.readdirSync(path).forEach(function(file){
		// .json is 5 characters
		files.push(file.slice(0,-5));
	});
	res.send(files);

}




var libraryNameToGridName = {'ChEA2':'ChEA','KEGG_pathways':'KEGG_new',
'WikiPathways_pathways':'WikiPathways','GeneOntology_BP':'GO_Biological_Process',
'GeneOntology_MF':'GO_Molecular_Function','MGI_MP_top4':'MGI_Mammalian_Phenotype_Level_4',
'ENCODE_TF_ChIP-seq_fuzzy':'ENCODE_TF_ChIP-seq',
'L1000_Kinase_Perturbations':'Kinase_Perturbations_from_L1000',
'KinasePerturbationsGEO_ChDir_37kinases_94perturbations':'Kinase_Perturbations_from_GEO',
'KEA':'KEA'};

var transformLibrary = function(libraryArr){
	var terms = [];
	var pvals = [];
	var scores = [];
	// deal with NaN?
	var library = {};
	libraryArr.forEach(function(e){
		if(e.term in library){
			library[e.term].count.push(e.count);
			library[e.term].posPercent.push(e.posPercent);
			library[e.term].pval.push(e.pval);
		}
		else{
			library[e.term] = {};
			library[e.term].count = [e.count];
			library[e.term].posPercent = [e.posPercent];
			library[e.term].pval = [e.pval];
		}
	});

	var average = function(arr){
		return us.reduce(arr,function(memo,num){return memo+num;},0)/arr.length;
	}

	for(key in library){
		library[key].count = average(library[key].count);
		library[key].pval = average(library[key].pval);
		library[key].posPercent = us.filter(library[key].posPercent,
			function(num){return num!="_NaN";});
		if(library[key].posPercent.length==0){
			library[key].posPercent = null;
		}
		else{
			library[key].posPercent = average(library[key].posPercent);
		}
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

exports.visualize = function(req,res){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	console.log(req.body.tag);
	var enrichResults = JSON.parse(req.body.res);
	var libraries = {}
	console.log(Object.keys(enrichResults));
	var tasks = {};
	for(var key in enrichResults){
		console.log('a',key);
		var gmtName = libraryNameToGridName[key];
		var libraryArr = enrichResults[key];
		var library = transformLibrary(libraryArr);
		// async???
		console.log('gmtName',gmtName);
		var getTask = function(gmtName,library){
			return function(callBack){

			var readFileCallback = function(err,data){
			console.log('!!!',gmtName);
			data = JSON.parse(data.toString());
			var tiles = [];
			data.forEach(function(e,i){
				var tile = {};
				tile.identity = e[0];
				tile.fitness = e[1];
				tile.idx = i;
				if(!library[tile.identity]){
					console.log('find similar term:',gmtName,tile.identity);
					tile.identity = mostSimilar(Object.keys(library),tile.identity);
				}
				tile.pval = library[tile.identity].pval;
				tile.count = library[tile.identity].count;
				tile.posPercent = library[tile.identity].posPercent;
				tiles.push(tile);
			});
			
			callBack(err,tiles);
		  }

			console.log('public/jsonGrids/'+gmtName+'.json');
			fs.readFile('public/jsonGrids/'+gmtName+'.json',readFileCallback);
		}
	}

		tasks[gmtName] = getTask(gmtName,library);
	}

	async.parallel(tasks,function(err,results){
		if(err) throw err;
		console.log(req.body.tag);
		var filename = req.body.tag + '_grids.html';
		// fs.writeFile('public/grids.json',JSON.stringify(results));
		fs.writeFile('public/explore/'+filename,
			exploreTemplateFn({grids:results}),
			function(err,results){
				if(err) throw err;
			});

		fs.writeFile('public/'+filename,
			templateFn({grids:results}),
			function(err,results){
				if(err) throw err;
				res.send(baseURL+filename);	
			});
	});

}



exports.visualizeCompare = function(req,res){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

	var enrichResults = JSON.parse(req.body.res);
	enrichRes2grids.main(enrichResults,res);
}








exports.saveSvg = function(req,res){
	var svgStrings = req.body;
	var archive = archiver('zip');
	var randomString = 'svg'+Math.random().toString(36).substring(7);
	var zipPath = 'public/download/'+randomString+'.zip'
	var output = fs.createWriteStream(zipPath);

	archive.on('error', function(err) {
  		throw err;
	});

	archive.pipe(output);

	for(var key in svgStrings){
		archive.append(svgStrings[key],{name:key+'.svg'});
	}


	archive.finalize();

	output.on('close',function(){
		res.send(randomString);
	});
	
}

exports.saveOneSvg = function(req,res){
	var svgString = '<svg>'+req.body.svg+'</svg>';
	// console.log(Object.keys(svgString));
	var randomString = 'svg'+Math.random().toString(36).substring(7);
	var path = 'public/download/'+randomString+'.svg';
	var output = fs.writeFile(path,svgString,function(err,results){
		if(err) throw err;
		res.send(randomString);
	});
}

exports.downloadSvg = function(req,res){
	var id = req.param('id');
	var prePath = 'public/download/'+id;
	if(fs.existsSync(prePath+'.zip')){
		var path = prePath+'.zip';
		var filename = 'result.zip';
	}else{
		var path = prePath+'.svg';
		var filename = 'result.svg';
	}

	res.download(path,filename,function(err){
		if(err) throw err;
		fs.unlink(path,function(err){
			if(err) throw err;
		});
	});
}