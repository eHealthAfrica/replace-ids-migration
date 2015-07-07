'use strict'
var JSONStream = require('JSONStream')
  , migrate    = require('./migrate')

function run() {
  var stdin  = this.stdin
    , db     = this.argv[2]
    , parser = JSONStream.parse('*')
    , data   = []

  return new Promise(function (resolve, reject) {
    if (!db) {
      reject(new Error('Missing option: database URL'))
    }

    stdin
      .pipe(parser)
        .on('error', reject)
        .on('data', function (datum) {
          data.push({ current:   datum.doc._id
                    , deprecate: datum.ids
                    })
        })
        .on('finish', function () {
          resolve(migrate(db, data))
        })
  })
}

function create(io) {
  return Object.create( { run: run }
                      , { stdin:  { get: function () { return io.stdin  } }
                        , argv:   { get: function () { return io.argv   } }
                        }
                      )
}

module.exports = create
