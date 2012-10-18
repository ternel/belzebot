var Debilotron = {};

Debilotron.Parser = function parser(client, from, to, cmd) {
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
        match = cmd.match(/T\'es (.+)/);
        client.say(to, "C'est toi le " + match[1]);
    }

};

module.exports.Debilotron = Debilotron;