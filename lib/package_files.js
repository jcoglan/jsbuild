var HTTP_REGEX = require('./http_regex')
    die        = require('./die')

module.exports = function(params, packages) {
  var files = []
  packages.forEach(function(pkg) {
    var paths = pkg._loader

    if (!(paths instanceof Array))
      die('Cannot bundle ' + pkg + ': no path specified in your manifest')

    if (params.stylesheets)
      paths = paths.concat(pkg._styles.list)

    if (!params.external)
      paths = paths.filter(function(p) { return !HTTP_REGEX.test(p) })

    paths.forEach(function(loader) { files.push(loader) })
  })
  return files
}

