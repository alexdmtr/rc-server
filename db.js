
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://nodejs:awesomepassword@ds135798.mlab.com:35798/heroku_d08mv7jf';


var state = {
  db: null,
}

exports.connect = function(done) {
  if (state.db) return done();

  MongoClient.connect(url, function(err, db) {
    if (err) return done(err)
    state.db = db
    done()
  })
}

exports.get = function() {
  return state.db
}

exports.close = function(done) {
  if (state.db) {
    state.db.close(function(err, result) {
      state.db = null
      state.mode = null
      done(err)
    })
  }
}