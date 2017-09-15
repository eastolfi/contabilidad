'use strict';

var MongoPortable = require('mongo-portable'),
    FileSystemStore = require('file-system-store'),
    _ = require('lodash');

module.exports = function(config) {
    var MOVIMIENTOS_COLLECTION = "movimientos";
    var PREDEFINIDOS_COLLECTION = "predefinidos";
    
    var db = new MongoPortable("contabilidad-ddbb");
    db.addStore(new FileSystemStore({
        ddbb_path: "database",
        sync: true
    }));

    return {
        // Movement
        searchMovement: function(filter, callback) {
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
        
        createMovement: function(data, callback) {
            var collection = db.collection(MOVIMIENTOS_COLLECTION);
            
            collection.insert(data, callback);  // TODO: Add model validation
        },
        
        updateMovement: function(item, callback) {
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
        
        deleteMovement: function(items, callback) {
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
         
        // Predefined Movements
        searchPredefined: function(filter, cb) {
            var collection = db.collection(PREDEFINIDOS_COLLECTION);
            
            collection.find(cb);
        },
        searchPredefinedComboList: function(callback) {
            var collection = db.collection(PREDEFINIDOS_COLLECTION);
            
            collection.find({}, {_id: -1, concept: 1, amount: 1, day: 1, type: 1}, callback);
        },
        createPredefined: function(data, callback) {
            var collection = db.collection(PREDEFINIDOS_COLLECTION);
            
            collection.insert(data, callback);
        },
        updatePredefined: function(item, callback) {
            var collection = db.collection(PREDEFINIDOS_COLLECTION);
            
            collection.update({
                _id: item._id
            }, {
                date: item.date,
                concept: item.concept,
                amount: item.amount,
                type: item.type
            }, callback);
        },
        deletePredefined: function(items, callback) {
            var collection = db.collection(PREDEFINIDOS_COLLECTION);
            
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
        
        // Exporting
        export: function(filter, callback) {
            var collection = db.collection(MOVIMIENTOS_COLLECTION);
            
            var types = filter.type;
            
            if (typeof types === 'string') {
                types = [types];
            }
            
            var queryAll = false;
            if (types.indexOf('all') !== -1) {
                queryAll = true;
            }
            
            var agg = [];
            
            if (!queryAll) {
                agg.push({
                    $match: {
                        "type": {
                            $in: types
                        }
                    }
                });
            }
            
            // Group by type
            agg.push({
                $group: {
                    _id: 'type',
                    "Total": {
                        $sum: "$amount"
                    }
                }
            });
            
            agg.push({
                $sort: {
                    "Total": -1
                }
            });
            
            collection.aggregate(agg, callback);
        },
        
        exportPDF: function(init, end, callback) {
            var collection = db.collection(MOVIMIENTOS_COLLECTION);
            
            var cursor = collection.find({
                $and: [{
                    date: {
                        $gte: init.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                    }
                }, {
                    date: {
                        $lte: end.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                    }
                }]
                // date: {
                //     $and: [{
                //         $gte: init.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                //     }, {
                //         $lte: end.format('YYYY-MM-DDTHH:mm:ss.SSSZ')
                //     }]
                // }
            }, {
                _id: 0,
                concept: 1,
                amount: 1,
                type: 1,
                date: 1
            }, {
                type: 1,
                date: -1
            });
            
            var docs = cursor.fetch();
            // cursor.forEach(function(doc) {
            //     docs.push(doc);
            // });
            
            // change to -> $project
            for (var i = 0; i < docs.length; i++) {
                docs[i].concepto = docs[i].concept;
                delete docs[i].concept;
                
                docs[i].tipo = docs[i].type;
                delete docs[i].type;
                
                docs[i].cantidad = docs[i].amount;
                delete docs[i].amount;
                
                docs[i].fecha = docs[i].date;
                delete docs[i].date;
            }
            
            callback(null, docs);
        },
        
        // Others
        execute: function() {}
    };
};