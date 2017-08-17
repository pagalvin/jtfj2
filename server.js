// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const flash = require('connect-flash');

var configDB = require('./server/config/config.js');

// configuration ===============================================================
mongoose.connect(configDB.mongoUrl); // connect to our database


// Get our API routes
const api = require('./server/routes/api');

const app = express();

// Using Pug as the view engine
app.set("view engine", "pug");
app.set("views", path.join(`${__dirname}/server`, "views"));

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/static', express.static(path.join(__dirname, 'public')))

// Set our api routes
app.use('/api', api);

// Set up Passport`
app.use(session({ secret: 'Quick Ben is Fast' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./server/routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./server/config/passport')(passport); // pass passport for configuration


//Catch all other routes and return the index file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/server/views/homepage.pug'));
// });

// Home page
app.get('*', (req, res) => {
  res.render("homepage");
})



/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));