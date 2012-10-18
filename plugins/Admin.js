var Admin = {};
var nconf = require('nconf');
var exec = require('child_process').exec;

Admin.support = function support(message) {
    cmd = message.split(' ');
    
    return (cmd[0] == '!admin' && cmd[1] == nconf.get('password'));
};

Admin.handle = function (client, from, to, message) {
    cmd = message.split(' ');
    
    if (cmd[2] == 'restart') {
        this.restart(client, from, to, cmd);
    }
    
    if (cmd[2] == 'update') {
        this.update(client, from, to, cmd);
    }
};

Admin.restart = function (client, from, to, cmd) {
    // @TODO: ajouter la possibilité de préciser le chan sur lequel
    // envoyer le message dans la commande
    // ex: !lastfm #channel ternel
    if (nconf.get('bot-name') == to) {
        to = '#eistibranlos';
    }
    
    client.say(to, "Restarting bot in a few seconds ...");
    
    setTimeout(function () {
        process.exit(1);
    }, 5000);
};

Admin.update = function (client, from, to, cmd) {
    client.say(from, "Updating bot ...");
    
    exec("git pull origin master", function (error, stdout, stderr) {
        if (stdout) {
            client.say(from, stdout);
        }
        
        if (stderr) {
            client.say(from, stderr);
        }
        
        if (error) {
            client.say(from, error);
        }
    });
};

module.exports.Admin = Admin;