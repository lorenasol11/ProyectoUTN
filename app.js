var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var nodemailer = require('nodemailer');

require('dotenv').config();
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/admin/login'); //
var adminRouter = require('./routes/admin/novedades');
var apiRouter = require('./routes/api');
const router = require('./routes/index');

//const { truncate } = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'PW2021awqyeudj',
  cookie: {maxAge: null},
  resave: false,
  saveUninitialized: true
}));

secured = async (req, res, next) => {
  try {
    console.log(req.session.id.usuario);
    if (req.session.id_usuario){
      next()
    } else {
      res.redirect('/admin/login');
    } //cierro else
  } catch (error) {
    console.log(error);
  }// cierro catch error
} // cierro secured

app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);  //
app.use('/admin/novedades', secured, adminRouter);
app.use('/api', cors() ,apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler


app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


router.post('/contacto', async (req, res) => {
    const mail = {
      to:'louresol11@gmail.com',
      subject: 'Contacto Web',
      html: `${req.body.nombre} se contacto a traves de la web y quiere mas informacion a este correo: ${req.body.email} <br> Además, hizo el siguiente comentario: ${req.body.mensaje} <br> Su tel es: ${req.body.telefono}`
    }

    const trekking = nodemailer.trekking ({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    }); //cierra transp

    await trekking.sendMail(mail)

    res.status(201).json({
      error: false,
      message: 'Mensaje enviado'
    });
    
}); //cierro post/api

module.exports = app;
