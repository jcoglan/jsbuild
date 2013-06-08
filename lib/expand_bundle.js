var array  = require('./array'),
    expand = require('./expand')

module.exports = function(Package, bundles, packages, excluded, name) {
  var bundle = bundles[name]

  array(bundle.include).forEach(function(p) { expand(Package, p, packages) })

  var expandExcluded = function(excl) {
    var exclBundle = bundles[excl]
    if (!exclBundle) return expand(Package, excl, excluded)

    array(exclBundle.include).forEach(function(p) { expand(Package, p, excluded) })
    array(exclBundle.exclude).forEach(expandExcluded)
  }
  array(bundle.exclude).forEach(expandExcluded)
}

