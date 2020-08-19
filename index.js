const express = require('express');
const app = express();
// Imports
const cors = require('cors');
const morgan = require("morgan");
const router = require('./routes');
const { PORT } = require('./constants');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const passport = require('./passport/localStrategy');
const dbConnection = require('./database/mongodb/config');
const { handleError } = require('./interceptors/errors');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// parse cookies
app.use(cookieParser())
// Logger for requests
app.use(morgan("dev"));

app.use(passport.initialize());
app.use(passport.session())
// API Routes
app.use(router);

// Error Handler
app.use((err, req, res, next) => {
    handleError(err, res);
});

app.listen(PORT, (error, data) => {
    if (error) console.log("Error Occurred while startign the server");
    else {
        console.log("Connected to the server");
        dbConnection; // Database connection 
    }
});