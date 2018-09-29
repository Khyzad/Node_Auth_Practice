const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');


const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

const routes = require('./routes/index');
const users = require('./routes/api/user-routes');

const app = express();

// view engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');

// bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// passport init
app.use(passport.initialize());
app.use(passport.session());

// express validator, taken from github
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        const namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}))

// connect flash 
app.use(flash());

// global consts
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// routes
app.use('/', routes);
app.use('/user', users);

// setup port
app.set('port', (process.env.PORT || 8080));
app.listen(app.get('port'), function () {
    console.log('Server starterd on port ' + app.get('port'));
}); 