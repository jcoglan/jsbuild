var read    = require('./read'),
    resolve = require('./resolve')

var expandCSS = function(root, file, css, callback) {
  var assets   = css.match(/\burl\s*\(("(\\.|[^"])*"|'(\\.|[^'])*'|[^\)]*)\)/g) || [],
      length   = assets.length,
      inline   = [],
      complete = 0

  if (length === 0) return callback(css)

  var rewrite = function() {
    inline.forEach(function(pair) {
      css = css.replace(pair[0], pair[1])
    })
    callback(css)
  }

  assets.forEach(function(snippet, i) {
    var url  = snippet.replace(/^url\s*\(('|"|)/, '').replace(/('|"|)\)$/, ''),
        pth  = resolve(root, file, url),
        type = url.split('.').pop()

    var fill = function(buffer) {
      var mime   = (type === 'css') ? 'text/css' : 'image/' + type,
          base64 = (typeof buffer === 'string')
                 ? buffer
                 : 'url(data:' + mime + ';base64,' + buffer.toString('base64') + ')'

      inline[i] = [snippet, base64]
      complete += 1
      if (complete === length) rewrite()
    }

    if (/^data:/.test(url)) return fill(snippet)

    read(pth, function(buffer) {
      if (type === 'css')
        expandCSS(root, pth, buffer.toString('utf8'), function(css) {
          fill(new Buffer(css, 'utf8'))
        })
      else
        fill(buffer)
    })
  })
}

module.exports = expandCSS

