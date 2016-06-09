'use strict';

var MongoPortable = require('mongo-portable'),
    FileSystemStore = require('file-system-store'),
    _ = require('lodash');

module.exports = function(config) {
    var MOVIMIENTOS_COLLECTION = "movimientos";
    var db = new MongoPortable("contabilidad-ddbb");
    db.addStore(new FileSystemStore({
        ddbb_path: "database"
    }));

    return {
        search: function(filter, cb) {
            var collection = db.collection(MOVIMIENTOS_COLLECTION);

            var where = {};

            if (filter) {
                where = {
                    $or: [
                        {concept: new RegExp(filter, "i")},
                        {$where: "\/" + filter + "\/.test(this.amount)"}
                    ]
                };
            }

            var cursor = collection.find(where);
            var docs = cursor.fetch();

            cb(docs);
        },
        create: function() {
            /*
             var newMove = new Movimiento(req.body);

             newMove.save(function(err) {

             });
             */
        },
        update: function() {
            /*
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
            */
        },
        delete: function() {
            /*
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
            */
        }
    };
};