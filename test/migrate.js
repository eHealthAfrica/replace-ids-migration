'use strict'
var test       = require('redtape')(beforeEach)
  , sinon      = require('sinon')
  , proxyquire = require('proxyquire')
  , events     = require('events')
  , _          = require('lodash')

function fakeFactory() {
  var factory = sinon.stub()
  factory.plugin = sinon.stub().returnsThis()
  return factory
}

function fakeDB() {
  return { migrate: sinon.stub().returns(Promise.resolve('done')) }
}

var migrate, PouchDB, migratePlugin, transformation

function beforeEach(done) {
  PouchDB        = fakeFactory()
  migratePlugin  = {}
  transformation = sinon.stub().returns(_.constant(null))

  migrate = proxyquire('../lib/migrate', { 'pouchdb'          : PouchDB
                                         , 'pouchdb-migrate'  : migratePlugin
                                         , './transformation' : transformation
                                         })
  done()
}

test('loads migration plugin', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
  migrate('http://my-db', data)
  t.ok(PouchDB.plugin.calledWith(migratePlugin))
  t.end()
})

test('creates db instance', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
  migrate('http://my-db', data)
  t.ok(PouchDB.calledWithNew())
  t.end()
})

test('creates db for given URL', function (t) {
  var data = [{ current: '123', deprecate: ['456'] }]
  migrate('http://my-db', data)
  t.ok(PouchDB.calledWith('http://my-db'))
  t.end()
})

test('applies transformation for passed in data', function (t) {
  var db   = fakeDB()
    , data = [{ current: '123', deprecate: ['456'] }]
    , cb   = function () {}
  PouchDB.returns(db)
  transformation.withArgs(data).returns(cb)
  migrate('http://my-db', data)
  t.ok(db.migrate.calledWith(cb))
  t.end()
})

test('returns promise from migration', function (t) {
  var db      = fakeDB()
    , data    = [{ current: '123', deprecate: ['456'] }]
    , promise = Promise.resolve('I am done.')
  PouchDB.returns(db)
  db.migrate.returns(promise)
  var result = migrate('http://my-db', data)
  t.equal(result, promise)
  t.end()
})
