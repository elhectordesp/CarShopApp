const express = require('express');
const app = express();
const server = require('http').Server(app);
const morgan = require('morgan');
const passport = require('passport');
const expressSession = require("express-session");
const {mongoose} = require('./database');

//Settings
app.set('port', process.env.PORT || 3977);
app.set('json spaces', 2); //Espacios en el formato json

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//Middlewares
app.use(morgan('dev')); //Para ver las peticiones por consola
app.use(express.json()); //Para entender los JSON
app.use(express.urlencoded({extended: true}));
app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla' 
  }));
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/api/user', require('./routes/user.routes'));

app.listen(app.get("port"), () => {
    console.log("Servidor en el puerto:" + app.get("port"));
});