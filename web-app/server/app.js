var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var registerHolder = require('./routes/registerHolder');
var createIdentity = require('./routes/createIdentity');
var createIssuer = require('./routes/createIssuer');
var createIssueRequest = require('./routes/createIssueRequest');
var createVerifier = require('./routes/createVerifier');
var createVerifyRequest = require('./routes/createVerifyRequest');
var fetchFileFromDatabase = require("./routes/fetchFileFromDatabase");
var getGenericData = require('./routes/getGenericData');
var grantAccess = require('./routes/grantAccess');
var issueIdentity = require('./routes/issueIdentity');
var logOut = require('./routes/logOut');
var readAssets = require('./routes/readAssets');
var readIndividualAsset = require('./routes/readIndividualAsset');
var requestAccess = require('./routes/requestAccess');
var revokeAccess = require('./routes/revokeAccess');
var verifyIdentity = require('./routes/verifyIdentity');
var verifyPassword = require('./routes/verifyPassword');
var updateAsset = require('./routes/updateAsset');

var app = express();
const cors = require('cors');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/registerHolder', registerHolder);
app.use('/createIdentity', createIdentity);
app.use('/createIssuer', createIssuer);
app.use('/createIssueRequest', createIssueRequest);
app.use('/createVerifier', createVerifier);
app.use('/createVerifyRequest', createVerifyRequest);
app.use('/fetchFileFromDatabase', fetchFileFromDatabase);
app.use('/getGenericData', getGenericData);
app.use('/grantAccess', grantAccess);
app.use('/issueIdentity', issueIdentity);
app.use('/logOut', logOut);
app.use('/readAsset', readAssets);
app.use('/readIndividualAsset', readIndividualAsset);
app.use('/requestAccess', requestAccess);
app.use('/revokeAccess', revokeAccess);
app.use('/verifyIdentity', verifyIdentity);
app.use('/verifyPassword', verifyPassword);
app.use('/updateAsset', updateAsset);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
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
