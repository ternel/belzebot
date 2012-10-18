var Misc = {};

Misc.support = function (message) {
    return message.match(/^!insult$/);
};

Misc.handle = function insult(client, from, to, message) {
    client.say(to, "belzebot, il te chie à la gueule.");
};

module.exports.Misc = Misc;