var fs = require('fs')
var path = require('path')

var root = '../../',
	RTestPath = root+'R/test/',
	examplePath = root+'public/data/';

var exampleInputs = [RTestPath+'ELK1-19687146-Hela cells-human.txt .n.txt',
				 RTestPath+'HSA04540_GAP_JUNCTION.txt .n.txt',
				examplePath+'example-genes-lite.txt'];

var inputs = []

exampleInputs.forEach(function(inputPath){
	var baseName = path.basename(inputPath,'.txt'),
		content = fs.readFileSync(inputPath),
		input = {};

	input.tag = baseName.slice(0,3);
	input.genes = content.toString();
	inputs.push(input);
})

fs.writeFileSync('input.json',JSON.stringify(inputs));