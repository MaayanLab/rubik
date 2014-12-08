var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var grids = require('./gridsRequestHandlers.js');


app.use('/rubik',express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(json());

app.get('/rubik/gridNames',grids.gridNames);

app.post('/rubik/visualize',grids.visualize);
app.post('/rubik/visualizeCompare',grids.visualizeCompare);

app.post('/rubik/saveSvg',grids.saveSvg);
app.get('/rubik/downloadSvg',grids.downloadSvg);

app.post('/rubik/saveOneSvg',grids.saveOneSvg);



app.post('/rubik/test',function(req,res){
	
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	console.log(JSON.parse(req.body.res));
	res.end();
});

// app.post('/grids/new',function(req,res){
// 	console.log(req.body);
// 	console.log('a');
// 	res.send('a');
// });

app.listen(8080);