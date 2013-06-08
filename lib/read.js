var HTTP_REGEX = require('./http_regex'),
    readLocal  = require('./read_local.js'),
    readRemote = require('./read_remote')

module.exports = function(file, callback) {
  console.error(' [READ] ' + file)
  var readFile = HTTP_REGEX.test(file) ? readRemote : readLocal
  readFile(file, callback)
}

