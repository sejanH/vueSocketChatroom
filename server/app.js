const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');


const socketHandler = require('./middlewares/socketHandler');
const chat = require('./routes/chat');

const app = express();
const secret = fs.readFileSync(path.resolve(__dirname, 'config/secret.key'), 'utf8');

// 禁用x-powered-by头
app.disable('x-powered-by');

// 启用session
app.use(session({
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
}));

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/api', chat);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

const server = socketHandler.createServer(app);

server.listen(3000);

console.log('listening on port', 3000);

