var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var grids = require('app/handlers.js');

app.use('/rubik',express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(json());


// API
app.post('/rubik/visualize',grids.visualize);
app.post('/rubik/visualizeCompare',grids.visualizeCompare);

//result page.
app.get('/rubik/gridNames',grids.gridNames);
app.post('/rubik/saveSvg',grids.saveSvg);
app.get('/rubik/downloadSvg',grids.downloadSvg);
app.post('/rubik/saveOneSvg',grids.saveOneSvg);


app.listen(8080);