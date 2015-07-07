'use strict'
var PouchDB        = require('pouchdb')
  , pouchMigrate   = require('pouchdb-migrate')
  , transformation = require('./transformation')

PouchDB.plugin(pouchMigrate)

function migrate(url, data) {
  var db = new PouchDB(url)
  return db.migrate(transformation(data))
}

module.exports = migrate
