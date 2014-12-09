exports.visualizeCompare = function(req,res){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

	var enrichResults = JSON.parse(req.body.res);
	var tags = Object.keys(enrichResults);
	var gridNames = us.map(Object.keys(enrichResults[tags[0]]),
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
		var enrichments = {};
		var canvases = {};
		tags.forEach(function(tag,i){
			var enrichResult = enrichResults[tag];
			var enrichment = {};
			for(var libraryName in enrichResult){
				var gridName = libraryNameToGridName[libraryName];
				var libraryResult = enrichResult[libraryName];
				var libraryResult = transformLibrary(libraryResult);
				// libraryResult: {term:{pval,pospercent,count}}
				enrichment[gridName] = libraryResult;
				
				// make use of the side effect of for loop to normalize term name in grid.
				if(i==0){
					var grid = grids[gridName];
					var canvas = [];
					grid.forEach(function(e){
						var tile = {};
						tile.identity = e[0];
						tile.fitness = e[1];
						tile.idx = i;
						if(!libraryResult[tile.identity]){
							console.log('find similar term:',gmtName,tile.identity);
							tile.identity = mostSimilar(Object.keys(library),tile.identity);
						}
						canvas.push(tile);
					});
					canvases[gridName] = canvas;
				}
			}

			enrichments{tag} = enrichment;
		}); // tags.forEach
		fs.writeFile('public/'+filename,
			compareTemplateFn({enrichments:enrichments,grids:canvases}),
			function(err,results){
				if(err) throw err;
				res.send(baseURL+filename);	
		});
	}); // async.parallel
}