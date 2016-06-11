'use strict';

var MongoPortable = require('mongo-portable'),
    FileSystemStore = require('file-system-store'),
    _ = require('lodash');

module.exports = function(config) {
    var MOVIMIENTOS_COLLECTION = "movimientos";
    var db = new MongoPortable("contabilidad-ddbb");
    db.addStore(new FileSystemStore({
        ddbb_path: "database",
        sync: true
    }));

    return {
        search: function(filter, callback) {
            var collection = db.collection(MOVIMIENTOS_COLLECTION);

            var where = {};

            if (filter) {
                var f = JSON.parse(filter);
                var or = [];
                
                if (f.date && f.date != '') {
                    or.push({
                        date: {
                            $gte: f.date
                        }
                    });
                }
                
                if (f.concept && f.concept != '') {
                    or.push({
                        concept: {
                            $regex: f.concept,
                            $options: 'ig'
                        }
                    });
                }
                
                if (f.amount && f.amount > 0) {
                    or.push({
                        amount: {
                            $gte: f.amount
                        }
                    });
                }
                
                if (f.types && f.types.length > 0) {
                    or.push({
                        type: {
                            $in: f.types
                        }
                    });
                }
                
                if (or.length > 0) {
                    where = {
                        $or: or
                    };
                }
            }

            collection.find(where, callback);
        },
        
        create: function(data, callback) {
            var collection = db.collection(MOVIMIENTOS_COLLECTION);
            
            collection.insert(data, callback);  // TODO: Add model validation
        },
        
        update: function(item, callback) {
            var collection = db.collection(MOVIMIENTOS_COLLECTION);
            
            collection.update({
                _id: item._id
            }, {
                date: item.date,
                concept: item.concept,
                amount: item.amount,
                type: item.type
            }, callback);
        },
        
        delete: function(items, callback) {
            var collection = db.collection(MOVIMIENTOS_COLLECTION);
            
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
            
            collection.remove({
                _id: {
                    $in: ids
                }
            }, callback);
        },
        
        export: function(filter, callback) {
            // var types = filter.type;
            
            // if (typeof types === 'string') {
            //     types = [types];
            // }
            
            // var queryAll = false;
            // if (types.indexOf('all') !== -1) {
            //     queryAll = true;
            // }
	        
            // var query = ' SELECT type, sum(amount) as Total FROM movimientos WHERE 1=1 ';
            // if (!queryAll) {
            //     query += ' AND type in ( ';
                
            //     for (var i = 0; i < types.length; i++) {
            //         var _type = types[i];
                    
            //         query += '\'' + _type + '\'';
                    
            //         if (i < types.length - 1) {
            //             query += ', ';
            //         }
            //     }
                
            //     query  += ' ) '
            // }
            // query += ' GROUP BY type ORDER BY Total desc; ';

            // var docs = [];
            // pg.connect(config.getConnectionString(), function(err, client, done) {
            //     if (err) cb(err);

            //     var res = client.query(query);

            //     res.on('row', function(row) {
            //         docs.push(row);
            //     });

            //     res.on('end', function() {
            //         client.end();
            //         cb(null, docs);
            //     });
            // });
        }
    };
};