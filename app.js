var express = require('express')
var debug = require('debug')('workspace:server')
var http = require('http')
const session = require('express-session')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var flash = require('connect-flash')
global.db = require('./db.js')

var index = require('./routes/index')
var game = require('./routes/game')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({secret: 'cats'}))
app.use(flash())
// app.set('trust proxy', 1) // trust first proxy
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

app.use(function (req, res, next) {
  console.log(req.session.user)

  res.locals.user = req.session.user
  res.locals.error = req.flash('error')
  res.locals.info = req.flash('info')
  res.locals.success = req.flash('success')

  if (!res.locals.error) { delete res.locals.error }
  if (!res.locals.info) {
    delete res.locals.info
  }
  if (!res.locals.success) {
    delete res.locals.success
  }
  // delete req.session.error;
  // delete req.session.info;
  // delete req.session.success;

  // console.log(res.locals.info);
  next()
})

global.requiredAuthentication = function requiredAuthentication (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.flash('info', 'You need to sign in first.')
    res.redirect('/login')
  }
}

app.use('/', index)
app.use('/game', game)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('pages/error')
})

module.exports = app

global.db.connect(function (err) {
  if (err) {
    console.log(err)
  } else {
    console.log('Connected to db')
  }
})

// -- here starts bin/www

var port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

var server = http.createServer(app)

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  var port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  var addr = server.address()
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
