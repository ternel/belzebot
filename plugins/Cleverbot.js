var CleverbotPlugin = {};
var nconf = require('nconf');
var CleverBot = require('../lib/cleverbot.js');

Cbot = new CleverBot;

CleverbotPlugin.support = function(message) {
    return message.match(/^!cleverbot (.+?)/gi);
};

CleverbotPlugin.handle = function(client, from, to, message) {
    // @TODO: ajouter la possibilité de préciser le chan sur lequel
    // envoyer le message dans la commande
    // ex: !lastfm #channel ternel
    if (nconf.get('bot-name') == to) {
        to = '#eistibranlos';
    }

    match = message.match(/^!cleverbot (.+?)/gi);

    Cbot.write({ message: match[1] }, function(data) {
        client.say(to, data.message);
    });
};

module.exports.CleverbotPlugin = CleverbotPlugin;