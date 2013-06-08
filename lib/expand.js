var expand = function(Package, name, list) {
  var pkg  = Package._getByName(name),
      deps = list || []

  pkg._deps.list.forEach(function(p) { expand(Package, p, deps) })
  if (deps.indexOf(pkg) === -1) deps.push(pkg)
  pkg._uses.list.forEach(function(p) { expand(Package, p, deps) })

  return deps
}

module.exports = expand

