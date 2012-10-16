var fs = require('fs');
var plugins = {};

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

// Recursive load plugin function
var load = function(dir){
  var plugin;
  fs.readdirSync(dir).forEach(function(file){
    var path = dir+'/'+file;

    // Directory
    if (fs.statSync(path).isDirectory()){
      loadPlugins(path);
      return;
    }

    // Ends with .prop
    if (file.endsWith('.js')){
      console.log('Loading plugin %s ...', path);
      var filename = file.substr(0, file.indexOf('.js'));
      plugin = require('../'+path);

      merge(plugins, plugin);
    }
  });
};

var merge = function(obj, other) {
    var keys = Object.keys(other);
    for (var i = 0, len = keys.length; i < len; ++i) {
        var key = keys[i];
        obj[key] = other[key];
    }
    return obj;
};


module.exports.load = load;
module.exports.plugins = plugins;