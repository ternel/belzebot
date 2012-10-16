function log(msg) {
    console.log(msg);
}

function info(msg) {
    log('[INFO] '+msg);
}

function error(msg) {
    log('[ERROR] '+msg);
}

module.exports.info = info;
module.exports.error = error;