var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');

var index = require('./routes/index');
var auth = require('./routes/auth')
var events = require('./routes/events');
var servicesSpots = require('./routes/servicesSpots');

var app = express();

var corsOptions = {
  origin: 'https://shatlik.ru',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   const allowedOrigin = process.env.ALLOWEDORIGIN || 'https://shatlik.ru'
//   res.header('Access-Control-Allow-Origin', allowedOrigin);
// //   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

//   // intercept OPTIONS method
//   if ('OPTIONS' == req.method) {
//     res.send(200);
//   } else {
//     next();
//   }
// })

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  next()
})

app.use('/', index);
app.use('/auth', auth)
app.use('/events', events);
app.use('/services/spots', servicesSpots);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
