var LastFM = {};
var http = require('http');

LastFM.LastSong = function LastSong(client, from, to, cmd, api_key, logger) {
    if (undefined !== logger) {
        logger.info("[LastFM] LastFM_GetLastSong");
    }

    var user = cmd[1];

    var options = {
        host : 'ws.audioscrobbler.com',
        port : 80,
        path : '/2.0/?method=user.getrecenttracks&api_key=' + api_key + '&format=json&user=' + user
    };

    http.get(options, function(res) {
        var json_data = '';
        res.on('data', function(chunk) {
            json_data = json_data + chunk;
            try {
                var parsed_data = JSON.parse(json_data);
                var track = parsed_data.recenttracks.track[0];
                var optionsYoutube = {
                    host : 'gdata.youtube.com',
                    port : 80,
                    path : '/feeds/api/videos?alt=json&q=' + encodeURIComponent(track.artist['#text']) + '+' + encodeURIComponent(track.name)
                };

                http.get(optionsYoutube, function(res) {
                    var json_data = "";
                    res.on('data', function(chunk) {
                        json_data += chunk;
                        try {
                            var parsed_data = JSON.parse(json_data);
                            var youtube_entry = parsed_data.feed.entry[0];
                            var link = youtube_entry.media$group.media$player[0].url;

                            client.say(to, "[LastFM:" + user + "] " + track.artist['#text'] + ' - ' + track.name + ' - ' + link);

                        } catch (e) {
                        }
                    });
                });

                json_data = '';
            } catch (e) {
            }
        });

        if (undefined !== logger) {
            logger.info("[LastFM] Got response: " + res.statusCode);
        }

    }).on('error', function(e) {
        if (undefined !== logger) {
            logger.error("[LastFM] Got error: " + e.message);
        }
    });
};

module.exports.LastFM = LastFM;