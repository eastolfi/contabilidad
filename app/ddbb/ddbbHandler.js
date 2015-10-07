module.exports = function(config) {
    var mongoHandler = require('./crud_mongodb')(config.handler),
        postgreHandler = require('./crud_postgresql')(config.handler);

    return {
        search: function(filter, cb) {
            if (config.handler.isMongoDB) {
                mongoHandler.search(filter, cb);
            } else if (config.handler.isPostgreSQL) {
                postgreHandler.search(filter, cb);
            }
        },
        create: function(item, cb) {
            if (config.handler.isMongoDB) {
                mongoHandler.create(item, cb);
            } else if (config.handler.isPostgreSQL) {
                postgreHandler.create(item, cb);
            }
        },
        update: function(item, cb) {console.log(config.handler);
            if (config.handler.isMongoDB) {
                mongoHandler.search(item, cb);
            } else if (config.handler.isPostgreSQL) {
                postgreHandler.search(item, cb);
            }
        },
        delete: function(items, cb) {
            if (config.handler.isMongoDB) {
                mongoHandler.search(items, cb);
            } else if (config.handler.isPostgreSQL) {
                postgreHandler.search(items, cb);
            }
        }
    };
};