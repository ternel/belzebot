var Debilotron = {};
var nconf = require('nconf');

Debilotron.support = function (message) {
    return (message[0] !== '!');
};

var dogs = ['Beethoven', 'Benji', 'Choupette', 'Copernic', 'Crockdur', 'Idéfix', 'Lassie', 'Le Clochard', 'Odie', 'Rex', 'Milou', 'Rintintin'];

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

    if (cmd.match(/caca/gi) || cmd.match(/crotte/gi)) {
        client.say(to, "Yumi, c'est bon le caca !");
    }

    if (cmd.match(/merci/gi)) {
        client.say(to, "De rien " + from + ", ça m'a fait plaisir");
    }

    if (cmd.match(/bonjour/gi) || cmd.match(/coucou/gi) || cmd.match(/salut/gi) || cmd.match(/wop/gi) || cmd.match(/kikou/gi) || cmd.match(/yop/gi) || cmd.match(/bjour/gi)) {

        if (from.match(/mateo/gi)) {
            var rand_index = Math.floor(Math.random() * (dogs.length + 1));
            client.say(to, "Coucou " + dogs[rand_index]);
        } else {
            client.say(to, "Coucou " + from);
        }
    }

    if (cmd.match(/T\'es (.+?)/)) {
        match = cmd.match(/T\'es (.+) ?(.+?)/);
        client.say(to, "S'toi le " + match[1]);
    }

    if (cmd.match(/poney/gi)) {
        client.say(to, "♪♪ Des poneys par milliers ♪♪");
    }

    if (cmd.match(/peep/gi)) {
        client.say(to, "BO PEEP BO PEEP BO PEEP BO PEEP BO PEEP BO PEEP BO PEEP BO PEEP  OOOOOOHHHHH - http://www.youtube.com/watch?v=Pz-tV5na89U");
    }

    if (cmd == "lol" || cmd == "\\o/") {
        client.say(to, "Trop marrant :(");
    }

    randomNumber = Math.floor(Math.random()*101);

    if (randomNumber == 1) {
        client.say(to, "kamoulox!");
    }
};

module.exports.Debilotron = Debilotron;
