var path       = require('path'),
    url        = require('url'),
    HTTP_REGEX = require('./http_regex')

module.exports = function(root, file, ref) {
  if (HTTP_REGEX.test(ref)) {
    return ref
  } else if (HTTP_REGEX.test(file)) {
    var uri = url.parse(file)
    return uri.protocol + '//' + uri.host + path.resolve(path.dirname(uri.pathname), ref)
  } else {
    if (root && /^\//.test(ref)) ref = (root + '/' + ref).replace(/\/+/g, '/')
    return path.resolve(path.dirname(file), ref)
  }
}

