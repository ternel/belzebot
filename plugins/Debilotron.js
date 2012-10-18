var Debilotron = {};

Debilotron.Parser = function parser(client, from, to, cmd) {
    if (cmd.match(/réponse/gi) || cmd.match(/reponse/gi)) {
        client.say(to, 42);
    }
};

module.exports.Debilotron = Debilotron;