'use strict'
var test       = require('redtape')(beforeEach)
  , sinon      = require('sinon')
  , proxyquire = require('proxyquire')
  , _          = require('lodash')

var transformation, transform

function beforeEach(done) {
  transform = sinon.stub().returns(_.constant(null))
  transformation = proxyquire('../lib/transformation', { './transform': transform })
  done()
}

test('it partially applies data to transform', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
    , doc  = { _id: '456' }
  transformation(data)(doc)
  t.ok(transform.calledWith(doc, data))
  t.end()
})

test('returns result from transform', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
    , doc  = { _id: '456' }
  transform.returns([{ status: 'transformed' }])
  var result = transformation(data)(doc)
  t.deepEqual(result, [{ status: 'transformed' }])
  t.end()

})
