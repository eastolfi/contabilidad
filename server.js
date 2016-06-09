'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    http = require('http'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	favicon = require('serve-favicon');
	
// Load configurations
// Set the node environment variable if not set before
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

process.env.DDBB_TYPE = process.env.DDBB_TYPE || 'postgreSQL';

// DB Model
require(__dirname + '/app/movimiento.js');
	
// Application Instance
var app = express();

// Express Settings
app.use('/public', express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use(favicon(__dirname + '/favicon.ico'));

// Request body parsing middleware should be above methodOverride
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Application Routes
require(__dirname + '/app/routes.js')(app);

// Application Start
var PORT = process.env.PORT || '3000';
var server = http.createServer(app);
server.listen(PORT, function() {
    console.log('Servidor creado y escuchando en el puerto ' + PORT);
});