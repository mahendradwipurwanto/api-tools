var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes');
var headingRouter = require('./routes/heading');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/heading', headingRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).json({status: 'Not Found', message: "The requested URL was not found on the server"});
});

// error handler
app.use(function (err, req, res, next) {
    // return json error with message
    res.status(500).json({status: 'error', message: err.message});
});

// start the Express server
app.listen(3000, () => {
    console.log(`Server is running on port: 3000`)
})
