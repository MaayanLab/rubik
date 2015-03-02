var fs = require('fs');
var us = require('underscore');
// var packer = require('zip-stream');
var archiver = require('archiver');
var visualize = require('./visualize.js').visualize;
var enrich = require('./enrichment.js').enrich;



exports.visualize = function(req,res){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');

	var enrichResults = JSON.parse(req.body.res);
	visualize(enrichResults,res);
}

exports.enrich = function(req,res){
	enrich(req.body.input,res);
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
