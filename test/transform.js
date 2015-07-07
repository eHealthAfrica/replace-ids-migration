'use strict'
var test = require('redtape')()

var transform = require('../lib/transform')

test('returns null for unrelated documents', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
    , doc  = {}
  var result = transform(doc, data)
  t.equal(result, null)
  t.end()
})

test('replaces references to deprecated ids', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
    , doc  = { relatedId: '456' }
  var result = transform(doc, data)
  t.deepEqual(result, [{ relatedId: '123' }])
  t.end()
})

test('replaces multiple matches', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
    , doc  = { relatedId: '456', source: { other: '456' } }
  var result = transform(doc, data)
  t.deepEqual(result, [{ relatedId: '123', source: { other: '123' } }])
  t.end()
})

test('replaces multiple patterns', function (t) {
  var data = [ { current: '123', deprecate: ['456'] }
             , { current: 'abc', deprecate: ['def'] }
             ]
    , doc  = { relatedId: '456', other: 'def' }
  var result = transform(doc, data)
  t.deepEqual(result, [{ relatedId: '123', other: 'abc' }])
  t.end()
})

test('does not touch CouchDB internal ids', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
    , doc  = { _id: '456' }
  var result = transform(doc, data)
  t.deepEqual(result, null)
  t.end()
})

test('does not touch CouchDB internals', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
    , doc  = { source: { _rev: '456' } }
  var result = transform(doc, data)
  t.deepEqual(result, null)
  t.end()
})
