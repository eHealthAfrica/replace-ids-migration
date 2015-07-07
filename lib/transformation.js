'use strict'
var transform = require('./transform')
  , _         = require('lodash')

function create(data) {
  return _.partial(transform, _, data)
}

module.exports = create
