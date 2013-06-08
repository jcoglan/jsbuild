var CSS_REGEX = /\.css$/i,
    embedCSS  = require('./embed_css'),
    read      = require('./read')

var bundle = function(root, files, i, output) {
  if (i >= files.length) return output()
  var file = files[i]

  var next = function(code) {
    output(code.toString('utf8'))
    bundle(root, files, i + 1, output)
  }

  read(file, function(code) {
    if (CSS_REGEX.test(file))
      embedCSS(root, file, code.toString('utf8'), next)
    else
      next(code)
  })
}

module.exports = bundle

