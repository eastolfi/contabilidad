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
		Movimiento.find().sort('-created').exec(function(err, docs) {
			if (err) {
				console.log('Error:' + err);
				response.render('error', {
					status: 500
				});
			} else {			
				var data = {
					"count": docs.length,
					"data": docs
				};
				
				response.jsonp(data);
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
	app.post('/movement/:id', function(request, response) {
		/*
		var monedero = req.monedero;

		monedero = _.extend(monedero, req.body);

		monedero.save(function(err) {
			if (err) {
				return res.send('users/signup', {
					errors: err.errors,
					monedero: monedero
				});
			} else {
				res.jsonp(monedero);
			}
		});
		*/
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