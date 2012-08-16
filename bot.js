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
        log(from + ' => ' + to + ': ' + message);

        // @TODO: ajouter la possibilité de préciser le chan sur lequel envoyer le message dans la commande
        // ex: !lastfm #channel ternel
        if (nconf.get('bot-name') == to) {
          to = '#eistibranlos';
        }

        /**
         * LASTFM : fetch last song played
         * @TODO : API Key in conf file
         */
        if ('!lastfm' == cmd[0] && undefined !== cmd[1]) {
            LastFM_GetLastSong(cmd);

        }
    }
}

function LastFM_GetLastSong(to, user, data) {
  var user = cmd[1];

  var options = {
    host: 'ws.audioscrobbler.com',
    port: 80,
    path: '/2.0/?method=user.getrecenttracks&api_key='+nconf.get('lastfm:api_key')+'&format=json&user='+user
  };

  http.get(options, function(res) {
    var json_data = '';
    res.on('data', function (chunk) {
      json_data = json_data+chunk;
      try
      {
        var parsed_data = JSON.parse(json_data);
        var track = parsed_data.recenttracks.track[0];
        client.say(to, "[LastFM:"+user+"] "+track.artist['#text']+' - '+track.name);
        json_data = '';
      }
      catch(e)
      {}
    });

    log("Got response: " + res.statusCode);

  }).on('error', function(e) {
    log("Got error: " + e.message);
  });
}


function log(msg) {
  if (nconf.get('debug')) {
    console.log(msg);
  }
}
