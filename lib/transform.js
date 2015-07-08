'use strict'

function isDeprecated(doc, data) {
  return deprecatedIds(data).indexOf(doc._id) >= 0
}

function deprecatedIds(data) {
  var deprecated = data.map(function (d) { return d.deprecate })
  return Array.prototype.concat.apply([] , deprecated)
}

function update(input, data) {
  return data.reduce(function (json, datum) {
    return json.replace(pattern(datum.deprecate), value(datum.current))
  }, input)
}

function pattern(ids) {
  return new RegExp('"(?!_)([^"]*)":"(?:' +  ids.join('|') + ')"', 'g')
}

function value(id) {
  return '"$1":"' + id + '"'
}

function transform(doc, data) {

  if (isDeprecated(doc, data)) {
    return [ {_id: doc._id, _rev: doc._rev, _deleted: true} ]
  } else {
    var serialized  = JSON.stringify(doc)
      , transformed = update(serialized, data)

    if (transformed !== serialized) {
      return [ JSON.parse(transformed) ]
    } else {
      return null
    }
  }
}

module.exports = transform
