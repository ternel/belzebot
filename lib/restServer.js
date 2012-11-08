var restify = require('restify');
var nconf = require('nconf');



function respond(req, res, next) {
    res.send('hello ' + req.params.name);
}


var start = function(client) {
    var server = restify.createServer({
        name:"Belzebot Rest Server"
    });
    server.get('/msg/:msg', function (req, res, next) {
        client.say(nconf.get('irc:channels'), req.params.msg);
        res.send('OK.');
    });

    server.listen(8080, function() {
        console.log('%s listening at %s', server.name, server.url);
    });
}


module.exports.start = start;
