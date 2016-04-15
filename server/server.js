var express = require('express');
var mongoose = require('mongoose');

var app = express();
// ========================================
// Connect to local mongodb named "bolt"
// Uncomment line 9 to use a local database
// Be sure to re-comment line 9 when submitting PR
// mongoose.connect('mongodb://localhost/bolt');
// ========================================

// ========================================
// Connect to mongolab database
// Please replace this line with your own
//  mongolab link
var mongoURI = 'mongodb://heroku_9qz2s9d9:Thomas13@ds011331.mlab.com:11331/heroku_9qz2s9d9'
// var mongoURI = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/bolt';
mongoose.connect(mongoURI);
// ========================================

require('./config/middleware.js')(app, express);
require('./config/routes.js')(app, express);

// start listening to requests on port 8000
var port = Number(process.env.PORT || 8000);
app.listen(port, function () {
  console.log(`server listening on port ${port}`);
});


// export our app for testing and flexibility, required by index.js
module.exports = app;
