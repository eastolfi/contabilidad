'use strict';

var pg = require('pg'),
    _ = require('lodash');

module.exports = function(config) {
    return {
        search: function(filter, cb) {
            var query = ' SELECT * FROM movimientos WHERE 1=1 ';
            if (filter) {
                var f = JSON.parse(filter);
                
                if (f.date && f.date != '') {
                    query += ' AND date >= \''+f.date+'\' ';
                }
                if (f.concept && f.concept != '') {
                    query += ' AND lower(concept) LIKE \'%'+f.concept+'%\' ';
                }
                if (f.amount && f.amount > 0) {
                    query += ' AND amount >= ' + f.amount;
                }
                if (f.types && f.types.length > 0) {
                    query += ' AND type in ( ';
                
                    for (var i = 0; i < f.types.length; i++) {
                        var _type = f.types[i];
                        
                        query += '\'' + _type + '\'';
                        
                        if (i < f.types.length - 1) {
                            query += ', ';
                        }
                    }
                    
                    query  += ' ) '
                }
            }
            query += ';';

            var docs = [];
            pg.connect(config.getConnectionString(), function(err, client, done) {
                if (err) cb(err);

                var res = client.query(query);

                res.on('row', function(row) {
                    docs.push(row);
                });

                res.on('end', function() {
                    client.end();
                    cb(null, docs);
                });
            });
        },
        create: function(item, cb) {
            var query = ' INSERT INTO movimientos (date, concept, amount, type) VALUES( ';

            query += '\'' + item.date + '\', \'' + item.concept + '\', ' + item.amount + ', \'' + item.type + '\' );';

            pg.connect(config.getConnectionString(), function(err, client, done) {
                if (err) cb(err);

                var res = client.query(query);

                res.on('end', function() {
                    client.end();
                    cb(null, item);
                });
            });
        },
        update: function(item, cb) {
            var query = ' UPDATE movimientos SET ';
            query += 'date = \'' + item.date + '\', concept = \'' + item.concept + '\', amount = ' + item.amount + ', type = \'' + item.type + '\'';
            query += ' WHERE 1=1 AND _id = ' + item._id + ';';

            pg.connect(config.getConnectionString(), function(err, client, done) {
                if (err) cb(err);

                var res = client.query(query);

                res.on('end', function() {
                    client.end();
                    cb(null, item);
                });
            });
        },
        delete: function(items, cb) {
            var moves = [];

            if (!_.isArray(items)) {
                if (_.isString(items)) {
                    moves.push(JSON.parse(items));
                } else {
                    moves.push(items);
                }
            } else {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (_.isString(item)) {
                        moves.push(JSON.parse(item));
                    } else {
                        moves.push(item);
                    }
                }
            }

            var ids = _.pluck(moves, '_id');

            var _in = ' ( ';
            ids.forEach(function(item, index) {
                _in += item.toString();
                if (index < ids.length - 1) _in += ', ';
            });
            _in += ' ) ';
            var query = ' DELETE FROM movimientos WHERE 1=1 AND _id IN ' + _in + ';';
            pg.connect(config.getConnectionString(), function(err, client, done) {
                if (err) cb(err);

                var res = client.query(query);

                res.on('end', function() {
                    client.end();
                    cb(null, items);
                });
            });
        },
        export: function(filter, cb) {
            // var total = filter.registros;
	        var types = filter.type;
	        
	        if (typeof types === 'string') {
	            types = [types];
	        }
	        
	        var queryAll = false;
	        if (types.indexOf('all') !== -1) {
	            queryAll = true;
	        }
	        
            var query = ' SELECT type, sum(amount) as Total FROM movimientos WHERE 1=1 ';
            if (!queryAll) {
                query += ' AND type in ( ';
                
                for (var i = 0; i < types.length; i++) {
                    var _type = types[i];
                    
                    query += '\'' + _type + '\'';
                    
                    if (i < types.length - 1) {
                        query += ', ';
                    }
                }
                
                query  += ' ) '
            }
            query += ' GROUP BY type ORDER BY Total desc; ';

            var docs = [];
            pg.connect(config.getConnectionString(), function(err, client, done) {
                if (err) cb(err);

                var res = client.query(query);

                res.on('row', function(row) {
                    docs.push(row);
                });

                res.on('end', function() {
                    client.end();
                    cb(null, docs);
                });
            });
        }
    };
};