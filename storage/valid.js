var semver = require("semver")

exports.name = function validName (name) {

  if (!name) return false

  var n = name.replace(/^\s+|\s+$/g, '')

  if (!n || n.charAt(0) === "."
    || !n.match(/^[a-zA-Z0-9]/)
    || n.match(/[\/\(\)&\?#\|<>@:%\s\\\*'"!~`]/)
    || n.toLowerCase() === "node_modules"
    || n !== encodeURIComponent(n)
    || n.toLowerCase() === "favicon.ico") {
    return false
  }

  return n
}

exports.package = function validPackage (pkg) {
  return validName(pkg.name) && semver.valid(pkg.version)
}
