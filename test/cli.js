'use strict'
var test       = require('redtape')(beforeEach)
  , sinon      = require('sinon')
  , proxyquire = require('proxyquire')
  , events     = require('events')
  , _          = require('lodash')

function fakeStream () {
  return _.assign( new events.EventEmitter()
                 , { pipe : sinon.stub().returnsArg(0) }
                 )
}

function fakeIo () {
  return { argv:  ['node', 'replace-ids-migration', 'http://host/db']
         , stdin: fakeStream()
         }
}

function fakeJSONStream () {
  var parser = fakeStream()
  return { parse: sinon.stub().returns(parser) }
}

var cli, io, JSONStream, parser, migrate

function beforeEach (done) {
  io         = fakeIo()
  parser     = fakeStream()
  JSONStream = fakeJSONStream()
  migrate    = sinon.stub().returns(Promise.resolve('Migration done.'))

  JSONStream.parse.returns(parser)

  cli = proxyquire('../lib/cli', { 'JSONStream' : JSONStream
                                 , './migrate'  : migrate
                                 })
  done()
}

test('parses rows from stdin', function (t) {
  JSONStream.parse.withArgs('*').returns(parser)
  cli(io).run()
  t.ok(io.stdin.pipe.calledWith(parser))
  t.end()
})

test('handles parse errors', function (t) {
  var error = new Error('Could not parse JSON')
  cli(io).run().catch(function (catched) {
    t.equal(catched, error)
    t.end()
  })
  parser.emit('error', error)
})

test('aborts when no db URL is given', function (t) {
  io.argv[2] = null
  cli(io).run().catch(function (error) {
    t.ok(error)
    t.end()
  })
})

test('starts migration when input finished parsing', function (t) {
  cli(io).run().then(function () {
    t.ok(migrate.calledOnce)
    t.end()
  })
  parser.emit('finish')
})

test('resolves with promise from migration', function (t) {
  migrate.returns(Promise.resolve('Yeah, done!'))
  cli(io).run().then(function (result) {
    t.equal(result, 'Yeah, done!')
    t.end()
  })
  parser.emit('finish')
})

test('passes db url to migration', function (t) {
  io.argv[2] = 'http://my-host/my-db'
  cli(io).run()
  parser.emit('finish')
  t.deepEqual(migrate.firstCall.args[0], 'http://my-host/my-db')
  t.end()
})

test('passes current and deprecated ids to migration', function (t) {
  cli(io).run()
  parser.emit('data', { doc: {_id: 'abc'}, ids: ['456', '789'] })
  parser.emit('data', { doc: {_id: 'def'}, ids: ['123', '765'] })
  parser.emit('finish')
  t.deepEqual( migrate.firstCall.args[1]
             , [ {current: 'abc', deprecate: ['456', '789']}
               , {current: 'def', deprecate: ['123', '765']}
               ]
             )
  t.end()
})
