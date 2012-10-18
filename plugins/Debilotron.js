var Debilotron = {};

Debilotron.Parser = function insult(client, from, to, cmd) {
	if (cmd.match('/réponse/') || cmd.match('/reponse/')) {
		client.say(to, 42);
	}
};

module.exports.Debilotron = Debilotron;