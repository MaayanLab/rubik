var request = require('request');
var visualize = require('./visualize.js').visualize;

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}



exports.enrich = function(input,res){
    var libraries = ['ChEA2','KEGG_pathways','WikiPathways_pathways',
    "GeneOntology_BP","GeneOntology_MF","MGI_MP_top4","KEA"]

    var options = {
        url: 'http://127.0.0.1:13373/custom/Rubik',
        method: 'POST',
        headers: headers,
        form: {'input': JSON.stringify(input),
            'libraries':JSON.stringify(libraries)}
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body,typeof(body))
            // res.send(body);
            // var enrichRes = JSON.parse(body);

            visualize(JSON.parse(body),res);
        }
    });
}
