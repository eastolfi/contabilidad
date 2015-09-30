'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Movimiento = mongoose.model('Movimiento'),
	path = require('path'),
    _ = require('lodash');

module.exports = function(app) {

	// Home
	app.get('/', function(request, response) {
		response.sendFile(path.resolve(__dirname + '/../public/views/index.html'));
	});

	// Find All
	app.get('/movement', function(request, response) {
		var where = {};
		
		if (request.query.filter) {
			where = {
				$or: [
					{concept: new RegExp(request.query.filter, "i")}, 
					{$where: "\/" + request.query.filter + "\/.test(this.amount)"}
				]
			};
		}
		
		Movimiento.find(where, function(err, docs) {
			if (err) {
				console.log('Error:' + err);
				response.render('error', {
					status: 500
				});
			} else {
				response.jsonp({"count": docs.length, "data": docs});
			}
		});
	});
	
	// Find All Paginado
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

	// Create One
	app.post('/movement', function(req, res) {
		var newMove = new Movimiento(req.body);
		
		newMove.save(function(err) {
			if (err) {
				return res.send('users/signup', {
					errors: err.errors,
					movimiento: newMove
				});
			} else {
				res.jsonp(newMove);
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
		var concept = request.body.concept;
		var date = request.body.date;
		var amount = request.body.amount;
		
		Movimiento.findById(request.body._id, function (err, movimiento) {
			if (err) {
				return response.send('users/signup', {
					errors: err.errors,
					monedero: movimiento
				});
			} else {
				movimiento.concept = concept;
				movimiento.date = date;
				movimiento.amount = amount;
				
				movimiento.save(function(err) {
					if (err) {
						return response.send('users/signup', {
							errors: err.errors,
							monedero: movimiento
						});
					} else {
						response.jsonp(movimiento);
					}
				});
			}
		})
	});
	
	// Delete Several
	app.delete('/movement', function(request, response) {
		var items = [];
				
		if (!_.isArray(request.query.moves)) {
			items.push(JSON.parse(request.query.moves));
		} else {
			for (var i = 0; i < request.query.moves.length; i++) {
				items.push(JSON.parse(request.query.moves[i]));
			}
		}
		
		var ids = _.pluck(items, '_id');
		Movimiento.remove({ "_id": {$in: ids} }, function(err) {
			if (err) {
				response.send({done: false});
			} else {
				response.send({done: true});
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
};