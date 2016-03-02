/**
 * Created by tom on 8/12/15.
 */

module.exports = function(app) {

//    var mw = require('./middleware');
    var log = app.get('log');
    var request = require('request');


    app.get('/api/v1/whitelabel?',  function(req, res, next) {
        var name = req.query.name;

        // Get the json info for the company
        request(    'http://dksl2s5vm2cnl.cloudfront.net/whitelabel/json/' + name + '.json', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                // Convert to a json object
                var info = JSON.parse(body);
                // Return the json data.
                res.json(info);
            }
        });
    });

};
