var expandCSS = require('./expand_css')

module.exports = function(root, file, css, callback) {
  expandCSS(root, file, css, function(css) {
    var base64 = new Buffer(css, 'utf8').toString('base64')
    css = "(function() {\n" +
          "  if (typeof document === 'undefined') return;\n" +
          "  var head  = document.getElementsByTagName('head')[0],\n" +
          "      style = document.createElement('style');\n" +
          "  try {\n" +
          "    style.type = 'text/css';\n" +
          "    style.innerHTML = '@import url(data:text/css;base64," + base64 + ")';\n" +
          "    head.appendChild(style);\n" +
          "  } catch (e) {}\n" +
          "})();"

    callback(css)
  })
}

