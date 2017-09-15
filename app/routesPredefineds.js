'use strict';

/**
 * Module dependencies.
 */
var	path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    moment = require('moment'),
    jsreport = require('jsreport'),
    Entities = require('html-entities').AllHtmlEntities;

moment.locale('es');

jsreport.renderDefaults.rootDirectory = path.resolve(__dirname + '/../node_modules/jsreport/node_modules');

module.exports = function(app, ddbbHandler) {

	// Home
	app.get('/', function(request, response) {
		response.sendFile(path.resolve(__dirname + '/../public/views/index.html'));
	});

	// Find All Predefined Movements
	app.get('/predefined', function(request, response) {
        // Setup filter
        var filter = request.query.filter;

        ddbbHandler.searchPredefined(filter, function(err, docs) {
            if (err) {
                console.error(err);
                response.render('error', {status: 500});
            } else {
                response.jsonp({"count": docs.length, "data": docs});
            }
        });
	});
	
	app.get('/predefined/comboList', function(request, response) {
        ddbbHandler.searchPredefinedComboList(function(err, docs) {
            if (err) {
                console.error(err);
                response.render('error', {status: 500});
            } else {
                response.jsonp({"count": docs.length, "data": docs});
            }
        });
	});

	// Create One Predefined Movement
	app.post('/predefined', function(request, response) {
        ddbbHandler.createPredefined(request.body, function(err, doc) {
            if (err) {
                return response.send('users/signup', {
                    errors: err.errors,
                    movimiento: doc
                });
            } else {
                response.jsonp(doc);
            }
        });
	});

	// Find One Predefined Movement
	app.get('/predefined/:id', function(request, response) {
		/*
		Monedero.findOne({_id: req.params.monederoId}, function(err, monedero) {
			if (err) {
				res.render('error', {
					status: 500
				});
			} else {
				res.jsonp(monedero);
			}
		});
		*/
	});

	// Update One Predefined Movement
	app.put('/predefined/:id', function(request, response) {
		ddbbHandler.updatePredefined(request.body, function(err, doc) {
            if (err) {
                return response.send('users/signup', {
                    errors: err.errors,
                    movimiento: doc
                });
            } else {
                response.jsonp(doc);
            }
        });
	});

	// Delete Several Predefined Movement
	app.delete('/predefined', function(request, response) {
        ddbbHandler.deletePredefined(request.query.moves, function(err, docs) {
            if (err) {
                return response.send('users/signup', {
                    errors: err.errors,
                    movimientos: docs
                });
            } else {
                response.jsonp(docs);
            }
        });
	});
};