function fullPath(pathPrefix, p){
  return pathPrefix.concat([p])
}

function isObject(v){
  return typeof v === 'object'
}

function arrayInArray(v, arr) {
  // Check whether `arr` contains an array that's shallowly equal to `v`.
  return arr.some(function(e) {
    if (e.length !== v.length) return false

    for (var i=0; i<e.length; i++) {
      if (e[i] !== v[i]) {
        return false
      }
    }

    return true
  })
}

exports.deepEquals = function deepEquals(o1, o2, ignoreKeys, pathPrefix){

  pathPrefix = pathPrefix || []
  ignoreKeys = ignoreKeys || []

  function hOP (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  if (typeof o1 !== typeof o2) {
    return false
  } else if (!isObject(o1)) {
    return o1 === o2
  }

  for (var prop in o1) {
    if (hOP(o1, prop) &&
        !arrayInArray(fullPath(pathPrefix, prop), ignoreKeys)) {
      if (!hOP(o2, prop) ||
          !deepEquals(o1[prop],
                      o2[prop],
                      ignoreKeys,
                      fullPath(pathPrefix, prop))) {
        return false
      }
    }
  }

  for (var prop in o2) {
    if (hOP(o2, prop) &&
        !hOP(o1, prop) &&
        !arrayInArray(fullPath(pathPrefix, prop), ignoreKeys)) {
      return false
    }
  }

  return true
}

exports.extend = function deepExtend(o1, o2) {
  // extend o1 with o2 (in-place)
  for (var prop in o2) {
    if (hOP(o2, prop)) {
      if (hOP(o1, prop)) {
        if (typeof o1[prop] === "object") {
          deepExtend(o1[prop], o2[prop])
        }
      } else {
        o1[prop] = o2[prop]
      }
    }
  }
  return o1
}
