exports.patch = function patch (Object, Date, Array, String) {
  if (!Date.parse || isNaN(Date.parse("2010-12-29T07:31:06Z"))) {
    Date.parse = require("Date").parse
  }

  Date.prototype.toISOString = Date.prototype.toISOString
    || require("Date").toISOString

  Date.now = Date.now
    || require("Date").now

  Object.keys = Object.keys
    || require("Object").keys

  Array.prototype.forEach = Array.prototype.forEach
    || require("Array").forEach

  Array.prototype.reduce = Array.prototype.reduce
    || require("Array").reduce

  Array.isArray = Array.isArray
    || require("Array").isArray

  String.prototype.trim = String.prototype.trim
    || require("String").trim
}
