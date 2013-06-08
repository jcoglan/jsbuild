var fs  = require('fs'),
    die = require('./die')

module.exports = function(file, callback) {
  fs.readFile(file, function(error, content) {
    if (error)
      die('Cannot find file ' + file + ', please check your --root setting')

    callback(content)
  })
}


