var Cleverbot = {};
var nconf = require('nconf');
var cleverBotLib = require('../lib/cleverbot.js');

Cleverbot.support = function(message) {
    return message.match(/^!cleverbot (.+?)/gi);
};

Cleverbot.handle = function(client, from, to, message) {
    // @TODO: ajouter la possibilité de préciser le chan sur lequel
    // envoyer le message dans la commande
    // ex: !lastfm #channel ternel
    if (nconf.get('bot-name') == to) {
        to = '#eistibranlos';
    }

    match = message.match(/^!cleverbot (.+?)/gi);

    cleverBotLib.write(match[1], function(data) {
        client.say(to, data);
    });
};

module.exports.Cleverbot = Cleverbot;