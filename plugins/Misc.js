var Misc = {};
var nconf = require('nconf');

Misc.support = function (message) {
    return message.match(/^!insult$/);
};

Misc.handle = function insult(client, from, to, message) {
    // @TODO: ajouter la possibilité de préciser le chan sur lequel
    // envoyer le message dans la commande
    // ex: !lastfm #channel ternel
    if (nconf.get('bot-name') == to) {
        to = '#eistibranlos';
    }

    client.say(to, "belzebot, il te chie à la gueule.");
};

module.exports.Misc = Misc;
