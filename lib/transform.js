'use strict'

function pattern(ids) {
  return new RegExp('"(?!_)([^"]*)":"(?:' +  ids.join('|') + ')"', 'g')
}

function value(id) {
  return '"$1":"' + id + '"'
}

function transform(doc, data) {
  var serialized  = JSON.stringify(doc)
    , transformed = serialized

  data.forEach(function (datum) {
    transformed = transformed.replace( pattern(datum.deprecate)
                                     , value(datum.current)
                                     )
  })

  if (transformed !== serialized) {
    return [JSON.parse(transformed)]
  } else {
    return null
  }
}

module.exports = transform
