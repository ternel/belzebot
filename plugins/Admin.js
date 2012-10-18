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
    client.say(to, "Restarting bot in a few seconds ...");
    sleep(5000);
    process.exit(1);
};

Admin.update = function (client, from, to, cmd) {
    client.say(to, "Updating bot ...");
    
    exec("git pull origin master", function (error, stdout, stderr) {
        if (stdout) {
            client.say(to, stdout);
        }
        
        if (stderr) {
            client.say(to, stderr);
        }
        
        if (error) {
            client.say(to, error);
        }
    });
};

module.exports.Admin = Admin;