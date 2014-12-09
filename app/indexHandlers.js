var request = require('request');

// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}

var options = {
    url: 'http://127.0.0.1:30167/custom/Rubik',
    method: 'POST',
    headers: headers,
    form: {'idx': '["a","b","c","e","f"]'}
}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log(body)
    }
});