var http  = require('http'),
    https = require('https'),
    url   = require('url'),
    die   = require('./die')

module.exports = function(file, callback) {
  var uri     = url.parse(file),
      client  = (uri.protocol === 'https:') ? https : http,
      port    = uri.port || (client === https ? '443' : '80'),
      options = {host: uri.hostname, port: port, path: uri.pathname},
      chunks  = [],
      length  = 0

  client.get(options, function(response) {
    if (response.statusCode < 200 || response.statusCode >= 300)
      die('Request unsuccessful: ' + file)

    response.addListener('data', function(chunk) {
      chunks.push(chunk)
      length += chunk.length
    })
    response.addListener('end', function() {
      var offset = 0,
          body   = new Buffer(length)

      chunks.forEach(function(chunk) {
        chunk.copy(body, offset)
        offset += chunk.length
      })
      callback(body)
    })
  })
  .on('error', function() {
    die('Request unsuccessful: ' + file)
  })
}

