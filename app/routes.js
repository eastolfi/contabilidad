'use strict';

/**
 * Module dependencies.
 */
var dbConfig = require('./ddbb/ddbbConfig')();
var ddbbHandler = require('./ddbb/ddbbHandler.js')(dbConfig),
	path = require('path'),
    _ = require('lodash');

module.exports = function(app) {

	// Home
	app.get('/', function(request, response) {
		response.sendFile(path.resolve(__dirname + '/../public/views/index.html'));
	});

	// Find All
	app.get('/movement', function(request, response) {
        // Setup filter
        var filter = request.query.filter;

        ddbbHandler.search(filter, function(err, docs) {
            if (err) {
                console.error(err);
                response.render('error', {status: 500});
            } else {
                response.jsonp({"count": docs.length, "data": docs});
            }
        });
	});
	
	// Find All Paginado
    /*
	app.get('/movementPaginado', function(request, response) {
		var query = request.query;
		
		var where = {};
		if (query.filter) where = JSON.parse(query.filter);
		
		Movimiento. find(where)
		.limit(query.limit)
		.skip((query.page - 1) * query.limit)
		.sort(query.order)
		.exec(function(err, docs) {
			if (err) {
				console.log('Error:' + err);
				response.render('error', {
					status: 500
				});
			} else {
				var data = docs;
				
				Movimiento.count({}, function(err, docs) {
					if (!err) {
						response.jsonp({"count": docs, "data": data});
					}
				});
			}
		});
	});
	*/

	// Create One
	app.post('/movement', function(request, response) {
        ddbbHandler.create(request.body, function(err, doc) {
            if (err) {
                return res.send('users/signup', {
                    errors: err.errors,
                    movimiento: doc
                });
            } else {
                response.jsonp(doc);
            }
        });
	});

	// Find One
	app.get('/movement/:id', function(request, response) {
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

	// Update One
	app.put('/movement/:id', function(request, response) {
		ddbbHandler.update(request.body, function(err, doc) {
            if (err) {
                return res.send('users/signup', {
                    errors: err.errors,
                    movimiento: doc
                });
            } else {
                response.jsonp(doc);
            }
        });
	});
	
	// Delete Several
	app.delete('/movement', function(request, response) {
        ddbbHandler.delete(request.query.moves, function(err, docs) {
            if (err) {
                return response.send('users/signup', {
                    errors: err.errors,
                    movimientos: docs
                });
            } else {
                response.jsonp(docs);
            }
        });

		
		
		/*
		async.parallel({
			function (callback) {
				Movimiento.remove({ id: { $in: ids } }, function (err) {
					if (err) return callback("Error while deleting " + err.message);
					callback(null, "Some useful message here...");
				});
			},
			function (err, result) {
				// check the error and do somethin useful with the results
			}
		});*/
		/*
		var monedero = req.monedero;

		monedero.remove(function(err) {
			if (err) {
				return res.send('users/signup', {
					errors: err.errors,
					monedero: monedero
				});
			} else {
				res.jsonp(monedero);
			}
		});*/
		
	});
	
	app.get('/getExport', function(request, response) {
	    ddbbHandler.export(request.query, function(err, docs) {
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