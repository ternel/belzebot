var nconf = require('nconf');
var irc = require('irc');
var http = require('http');
var logger = require('./lib/logger.js');
var restServer = require('./lib/restServer.js');
var pluginsManager = require('./lib/pluginsManager.js');

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({
    file : 'config.json'
});
nconf.defaults({
    'debug' : 'false',
    'password': 'password'
});

loadedMessage = pluginsManager.load('plugins');

var client = new irc.Client(nconf.get('irc:server'), nconf.get('bot-name'), {
    channels : nconf.get('irc:channels'),
    debug : nconf.get('debug'),
    floodProtection : true
});

client.addListener('topic', function(channel, topic, nick, message) {
    client.say(channel, "Tu as changé le topic... JAYJAY.");
});

client.addListener('message', PluginMessageListener);
client.addListener('message', parseMsg);

restServer.start(client);

function PluginMessageListener(from, to, message) {
    for (var plugin in pluginsManager.plugins) {
        try {
            pluginObject = pluginsManager.plugins[plugin];

            if (pluginObject.support(message)) {
                pluginObject.handle(client, from, to, message);
            }
        } catch(e) {
            client.say(from, "Error " + e.message);
            client.say(from, "Stack trace : "+ e.stack);
        }
    }
};

/*
 * client.addListener('pm', function (from, message) { console.log(from + ' =>
 * ME: ' + message); parseMsg(from, '#eistitest', message); }); //
 */

//@TODO Move this to plugin
function parseMsg(from, to, message) {
    if ('!' === message[0]) {
        var cmd = message.split(' ');
        logger.info(from + ' => ' + to + ': ' + message);

        // @TODO: ajouter la possibilité de préciser le chan sur lequel
        // envoyer le message dans la commande
        // ex: !lastfm #channel ternel
        if (nconf.get('bot-name') == to) {
            to = '#eistibranlos';
        }

        if ('!link' == cmd[0]) {

            if ('add' == cmd[1]) {
                Links_saveLink(from, to, cmd);
            }

            if ('last' == cmd[1]) {
                Links_lastsLink(from, to, cmd);
            }
        }

        // Random item from reddit :)
        if ('!reddit' == cmd[0]) {
            Reddit_getRandomLink(from, to, cmd);
        }
    }
}

function Reddit_getRandomLink(from, to, cmd) {
    logger.info("[Reddit] Reddit_getRandomLink");
    var subreddit = cmd[1];
    var limit = 5;

    var options = {
        host : 'www.reddit.com',
        port : 80,
        path : '/r/' + subreddit + '/.json?limit=' + limit,
        'user-agent' : 'belzebot, a shitty nodejs bot by /u/ternel'
    };

    http.get(options, function(res) {
        var json_data = '';
        res.on('data', function(chunk) {
            json_data = json_data + chunk;
            try {
                var parsed_data = JSON.parse(json_data);
                var min = 0;
                var rand_index = Math.floor(Math.random() * (limit - min + 1)) + min;

                client.say(to, "[Reddit:" + subreddit + ":" + rand_index + "] " + parsed_data.data.children[rand_index].data.title + " - " + parsed_data.data.children[rand_index].data.url);

                json_data = '';
            } catch (e) {
            }
        });

        logger.info("[Reddit] Got response from " + options.host + options.path + ": " + res.statusCode);

    }).on('error', function(e) {
        logger.error("[Reddit] Got error: " + e.message);
    });
}

function Links_saveLink(from, to, cmd) {
    var catArr = new Array('dev', 'fun', 'sexy', 'nsfw');
    var cat = cmd[2];
    var url = cmd[3];

    var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

    if (!RegExp.test(url) || !(catArr.inArray(cat))) {
        client.say(to, "[Links:Help] Utilisation : !link add [dev|fun|sexy|nsfw] url");
        return false;
    }

    var redis = require("redis"), redisClient = redis.createClient();

    // save in redis
    redisClient.on("error", function(err) {
        logger.error(err);
    });

    redisClient.lpush(cat, url, redis.print);
}

function Links_lastsLink(from, to, cmd) {
    var cat = cmd[2];
    var redis = require("redis"), redisClient = redis.createClient();

    if ('undefined' != cmd[2]) {
        limit = parseInt(cmd[2], 10);
    }

    // get in redis
    redisClient.lrange(cat, 0, 10, function(err, replies) {
        if (err) {
            return logger.error("error response - " + err);
        }

        logger.log(replies.length + " replies:");
        replies.forEach(function(reply, i) {
            logger.info("    " + i + ": " + reply);
            client.say(to, "[Links:" + cat + "] " + reply);
        });
    });
}

Array.prototype.inArray = function(p_val) {
    var l = this.length;
    for ( var i = 0; i < l; i++) {
        if (this[i] == p_val) {
            return true;
        }
    }
    return false;
};
