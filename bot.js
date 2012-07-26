var nconf = require('nconf');
var irc = require('irc');
var http = require('http');

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({ file: 'config.json' });
nconf.defaults({
    'debug': 'false'
  });

var client = new irc.Client(nconf.get('irc:server'), nconf.get('bot-name'), {
    channels: nconf.get('irc:channels'),
    debug: nconf.get('debug'),
});


client.addListener('message', parseMsg);

/*
client.addListener('pm', function (from, message) {
    console.log(from + ' => ME: ' + message);
    parseMsg(from, '#eistitest', message);
});
//*/

function parseMsg(from, to, message) {
    if ('!' === message[0]) {
        var cmd = message.split(' ');
        console.log(from + ' => ' + to + ': ' + message);

        // @TODO: ajouter la possibilité de préciser le chan sur lequel envoyer le message dans la commande
        // ex: !lastfm #channel ternel
        if ('fatabot' == to) {
          to = '#eistibranlos';
        }

        /**
         * LASTFM : fetch last song played
         * @TODO : API Key in conf file
         */
        if ('!lastfm' == cmd[0] && undefined !== cmd[1]) {
            var lastfm_url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&api_key=8c4df84b2b7c91d93a992dcccee83ba0&format=json"
            lastfm_url = lastfm_url+'&user='+cmd[1];

            var options = {
              host: 'ws.audioscrobbler.com',
              port: 80,
              path: '/2.0/?method=user.getrecenttracks&api_key=8c4df84b2b7c91d93a992dcccee83ba0&format=json&user='+cmd[1]
            };

            http.get(options, function(res) {
                var json_data = '';
                res.on('data', function (chunk) {
                    json_data = json_data+chunk;
                    try
                    {
                      var parsed_data = JSON.parse(json_data);
                      getLastSong(to, cmd[1], parsed_data);
                      json_data = '';
                    }
                    catch(e)
                    {}
                });

                console.log("Got response: " + res.statusCode);

            }).on('error', function(e) {
              console.log("Got error: " + e.message);
            });
        }
    }
}

function getLastSong(to, user, data) {
    var track = data.recenttracks.track[0];
    client.say(to, "[LastFM:"+user+"] "+track.artist['#text']+' - '+track.name);
}
