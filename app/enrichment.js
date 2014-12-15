var request = require('request');
var visualize = require('app/visualize.js').visualize;

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}



exports.enrich = function(input,res){
    var libraries = ['WikiPathways_pathways','KEGG_pathways']

    console.log(input.slice(0,20))
    var options = {
        url: 'http://127.0.0.1:15300/custom/Rubik',
        method: 'POST',
        headers: headers,
        form: {'input': JSON.stringify(input),
            'libraries':JSON.stringify(libraries)}
    }

    // Start the request
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            console.log(body)
            res.send(body);
            // var enrichRes = JSON.parse(body);
            // visualize(enrichRes,res);
        }
    });
}

