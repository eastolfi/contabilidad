'use strict';

var pg = require('pg'),
    _ = require('lodash');

module.exports = function(config) {
    return {
        search: function(filter, cb) {
            var query = ' SELECT * FROM movimientos WHERE 1=1 ';
            if (filter) {
                query += ' AND (lower(concept) LIKE \'%'+filter+'%\' OR to_char(amount, \'99999\') LIKE \'%'+filter+'\') ';
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
            var query = ' INSERT INTO movimientos (date, concept, amount) VALUES( ';

            query += '\'' + item.date + '\', \'' + item.concept + '\', ' + item.amount + ' );';

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
            query += 'date = \'' + item.date + '\', concept = `\'' + item.concept + '\', amount = ' + item.amount;
            query += ' WHERE 1=1 AND id = ' + item._id + ';';

            pg.connect(config.getConnectionString(), function(err, client, done) {
                if (err) cb(err);

                var res = client.query(query);

                res.on('end', function() {
                    client.end();
                    cb(null, item);
                })
            });
        },
        delete: function(items, cb) {
            var moves = [];

            if (!_.isArray(items)) {
                moves.push(JSON.parse(items));
            } else {
                for (var i = 0; i < items.length; i++) {
                    moves.push(JSON.parse(items[i]));
                }
            }

            var ids = _.pluck(moves, '_id');

            var _in = ' ( ';
            ids.forEach(function(item, index) {
                _in += item.toString();
                if (index < ids.lenght - 1) _in += ', ';
            });
            _in += ' ) ';
            var query = ' DELETE FROM movimientos WHERE 1=1 AND id IN ' + _in + ';';
            pg.connect(config.getConnectionString(), function(err, client, done) {
                if (err) cb(err);

                var res = client.query(query);

                res.on('end', function() {
                    client.end();
                    cb(null, items);
                });
            });
        }
    };
};