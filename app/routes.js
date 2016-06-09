'use strict';

/**
 * Module dependencies.
 */
var dbConfig = require('./ddbb/ddbbConfig')();
var ddbbHandler = require('./ddbb/ddbbHandler.js')(dbConfig),
	path = require('path'),
    _ = require('lodash'),
    fs = require('fs'),
    moment = require('moment'),
    jsreport = require('jsreport'),
    Entities = require('html-entities').AllHtmlEntities;

moment.locale('es');

jsreport.renderDefaults.rootDirectory = path.resolve(__dirname + '/../node_modules/jsreport/node_modules');

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
                return response.send('users/signup', {
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
                return response.send('users/signup', {
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
		var month = request.params.month - 1;
		var year = request.params.year;

		var init = moment().month(month).startOf('month');
		var end = moment().month(month).endOf('month');

		var tmplData = {
			reportMonth: init.format('MMMM')
		};

		var templatesPath = path.resolve(__dirname + '/../app/reports/templates');
		fs.readFile(templatesPath + '/template-1.json', function (err, data) {
			if (err) throw err;

			var tmpl = JSON.parse(data);

			var query = " SELECT MOV.concept AS Concepto, MOV.amount AS Cantidad, MOV.type as Tipo, MOV.date as Fecha, " +
						" ( " +
							" SELECT SUM(MOV2.amount) " +
							" FROM movimientos MOV2 " +
							" WHERE MOV2.date >= '"+init.format('YYYY-MM-DD')+"' " +
							" AND MOV2.date <= '"+end.format('YYYY-MM-DD')+"' " +
							" AND MOV2.type = MOV.type " +
						" ) as Total " +
						" FROM movimientos MOV   " +
						" WHERE MOV.date >= '"+init.format('YYYY-MM-DD')+"' " +
						" AND MOV.date <= '"+end.format('YYYY-MM-DD')+"' " +
						" ORDER BY Tipo ASC, Fecha ASC; ";

			ddbbHandler.execute(query, function(err, docs) {
				if (err) throw err;

				var movimientos = [];
				var insertedGroupes = [];
				var cont = -1;
				var nElements = 0;
				for (var i = 0; i < docs.length; i++) {
					var doc = docs[i];

					if (insertedGroupes.indexOf(doc.tipo) === -1) {
						cont++;

						if (nElements >= 10) {
							movimientos[cont-1].newPage = true;
							nElements = 0;
						}

						movimientos[cont] = {
							tipo: doc.tipo,
							total: doc.total,
							newPage: false,
							movimientos: []
						};
						insertedGroupes.push(doc.tipo);
					}

					movimientos[cont].movimientos.push({
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