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

        // LastFM : Last Track
        // @TODO : move lastfm code in a lastfm module
        // @TODO : LastSong + Spotify link (see Spotify search API), + deezer link (Deezer API)
        if ('!lastfm' == cmd[0] && undefined !== cmd[1]) {
            LastFM_GetLastSong(from, to, cmd);
        }

        if ('!mateo' == cmd[0]) {
          Bullshit_GetMateoReturn(from, to, cmd);
        }

        if ('!link' == cmd[0]) {

          if ('add' == cmd[1]) {
            Links_saveLink(from, to, cmd);
          }

          if ('last' == cmd[1]) {
            Links_lastsLink(from, to, cmd);
          }
        }
    }
}

function LastFM_GetLastSong(from, to, cmd) {
  log("[LastFM] LastFM_GetLastSong");
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

    log("[LastFM] Got response: " + res.statusCode);

  }).on('error', function(e) {
    log("[LastFM] Got error: " + e.message);
  });
}


function Bullshit_GetMateoReturn(from, to, cmd) {
  //@ 9 septembre
  var moment = require('moment');
  moment.lang('fr');
  var start = moment();
  var end = moment([2012, 8, 9]);

  client.say(to, "mateo revient du Québec dans "+start.from(end, true)+", à part si il se fait manger par un ours.");
}


function Links_saveLink(from, to, cmd) {
  var catArr = new Array('dev', 'fun', 'sexy', 'nsfw');
  var cat = cmd[2];
  var url = cmd[3];

  var RegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  if (!RegExp.test(url) || !(catArr.inArray(cat))) {
      client.say(to, "[Links:Help] Utilisation : !link add [dev|fun|sexy|nsfw] url");
      return false;
  }

  var redis = require("redis"),
        redisClient = redis.createClient();

  // save in redis
  redisClient.on("error", function (err) {
    console.log("Error " + err);
  });

  redisClient.lpush(cat, url, redis.print);
}

function Links_lastsLink(from, to, cmd) {
  var cat   = cmd[2];
  var limit = 5;
  var redis = require("redis"),
        redisClient = redis.createClient();

  if ('undefined' != cmd[2]) {
    limit = parseInt(cmd[2], 10);
  }

  // get in redis
  var links = redisClient.lrange(cat, 0, 10, function (err, replies) {
    if (err) {
        return console.error("error response - " + err);
    }

    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
        client.say(to, "[Links:"+cat+"] "+ reply);
    });
  });
}


Array.prototype.inArray = function(p_val) {
    var l = this.length;
    for(var i = 0; i < l; i++) {
        if(this[i] == p_val) {
            return true;
        }
    }
    return false;
}

function log(msg) {
  if (nconf.get('debug')) {
    console.log(msg);
  }
}
