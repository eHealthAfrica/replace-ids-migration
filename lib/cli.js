'use strict'
var JSONStream = require('JSONStream')

function run() {
  var stdin  = this.stdin
    , parser = JSONStream.parse('*')

  return new Promise(function (resolve, reject) {
    stdin
      .pipe(parser)
        .on('error' , reject)
        .on('finish', resolve)
  })
}

function create(io) {
  return Object.create( { run: run }
                      , { stdin:  { get: function () { return io.stdin  } } }
                      )
}

module.exports = create
