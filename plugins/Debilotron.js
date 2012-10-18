var Debilotron = {};

Debilotron.support = function (message) {
    return (message[0] !== '!');
};

Debilotron.handle = function (client, from, to, cmd) {
    // @TODO: ajouter la possibilité de préciser le chan sur lequel
    // envoyer le message dans la commande
    // ex: !lastfm #channel ternel
    if (nconf.get('bot-name') == to) {
        to = '#eistibranlos';
    }
    
    if (cmd.match(/réponse/gi) || cmd.match(/reponse/gi)) {
        client.say(to, 42);
    }

    if (cmd.match(/merci/gi)) {
        client.say(to, "De rien " + from + ", ça m'a fait plaisir");
    }

    if (cmd.match(/bonjour/gi) || cmd.match(/salut/gi) || cmd.match(/wop/gi) || cmd.match(/kikou/gi) || cmd.match(/yop/gi) || cmd.match(/bjour/gi)) {
        client.say(to, "Coucou " + from);
    }

    if (cmd.match(/T\'es (.+?)/)) {
        match = cmd.match(/T\'es (.+) ?(.+?)/);
        client.say(to, "S'toi le " + match[1]);
    }

    if (cmd == "lol" || cmd == "\\o/") {
        client.say("Trop marrant :(");
    }
};

module.exports.Debilotron = Debilotron;