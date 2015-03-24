var express = require('express');
var app = express();
var bodyParser = require('body-parser');

console.log(__dirname)
var  rubik = require('./app/handlers.js');

app.use('/rubik',express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(bodyParser.json({limit:'2mb',extended:true}));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(json());


// API
app.post('/rubik/visualize',rubik.visualize);
app.post('/rubik/enrich',rubik.enrich);

//result page.
app.post('/rubik/saveSvg',rubik.saveSvg);
app.get('/rubik/downloadSvg',rubik.downloadSvg);
app.post('/rubik/saveOneSvg',rubik.saveOneSvg);

console.log('listen at:',8183)
app.listen(8183);
