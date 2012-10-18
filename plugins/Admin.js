var Admin = {};
var exec = require('child_process').exec;

Admin.support = function(message) {
    cmd = message.split(' ');
    
    return (cmd[0] == '!admin' && cmd[1] == nconf.get('password'));
};

Admin.handle = function (client, from, to, message) {
    cmd = message.split(' ');
    
    if (cmd[2] == 'restart') {
        this.Restart(client, from, to, cmd);
    }
    
    if (cmd[2] == 'update') {
        this.Update(client, from, to, cmd);
    }
};

Admin.restart = function (client, from, to, cmd) {
    client.say(to, "Restarting bot ...");
    
    process.exit(1);
};

Admin.update = function (client, from, to, cmd) {
    client.say(to, "Updating bot ...");
    
    exec("git pull origin master", function (error, stdout, stderr) {
        client.say(to, stdout);
        
        if (stderr) {
            client.say(to, "ERROR : " + stderr);
        }
        
        if (error) {
            client.say(to, "ERROR : " + error);
        }
    });
};

module.exports.Admin = Admin;