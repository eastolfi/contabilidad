'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
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

	// Find All Movements
	app.get('/movement', function(request, response) {
        // Setup filter
        var filter = request.query.filter;

        ddbbHandler.searchMovement(filter, function(err, docs) {
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

	// Create One Movement
	app.post('/movement', function(request, response) {
        ddbbHandler.createMovement(request.body, function(err, doc) {
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

	// Find One Movement
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

	// Update One Movement
	app.put('/movement/:id', function(request, response) {
		ddbbHandler.updateMovement(request.body, function(err, doc) {
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

	// Delete Several Movement
	app.delete('/movement', function(request, response) {
        ddbbHandler.deleteMovement(request.query.moves, function(err, docs) {
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

	app.get('/pdfExport/:month/:year', function(request, response) {
		var month = request.params.month;
		var year = request.params.year;
		
		var initMonth = month,
			initYear = year,
			endMonth = month,
			endYear = year;
			
		if (month.indexOf('-') !== -1) {
			initMonth = month.split('-')[0];
			endMonth = month.split('-')[1];
		}
		
		if (year.indexOf('-') !== -1) {
			initYear = year.split('-')[0];
			endYear = year.split('-')[1];
		}

		var init = moment().month(initMonth).year(initYear).startOf('month');
		var end = moment().month(endMonth).year(endYear).endOf('month');

		var tmplData = {
			reportMonth: init.format('MMMM')
		};

		var templatesPath = path.resolve(__dirname + '/../app/reports/templates');
		fs.readFile(templatesPath + '/template-1.json', function (err, data) {
			if (err) throw err;

			var tmpl = JSON.parse(data);

			ddbbHandler.exportPDF(init, end, function(err, docs) {
				if (err) throw err;

				var movimientos = [];
				var insertedGroupes = {};
				var nElements = 0;
				for (var i = 0; i < docs.length; i++) {
					var doc = docs[i];

					if (_.isNil(insertedGroupes[doc.tipo])) {
						if (nElements >= 10) {
							movimientos[insertedGroupes[doc.tipo] - 1].newPage = true;
							nElements = 0;
						}
						
						insertedGroupes[doc.tipo] = movimientos.length;

						movimientos.push({
							tipo: doc.tipo,
							total: 0,
							newPage: false,
							movimientos: []
						});
					}

					movimientos[insertedGroupes[doc.tipo]].total += doc.cantidad;
					movimientos[insertedGroupes[doc.tipo]].movimientos.push({
						concepto: doc.concepto,
						cantidad: doc.cantidad,
						fecha: moment(doc.fecha).format('DD/MM/YYYY')
					});

					nElements++;
				}

				tmplData.data = movimientos;

				jsreport.render({
				 	template: tmpl,
				    data: tmplData
				})
				.then(function(out) {
					out.stream.pipe(response);
				}).catch(function(e) {
					response.end(e.message);
				});
			});
		});
	});
};