module.exports = function(config) {
    var handler = null;
    
    if (config.handler.isMongoDB) {
        handler = require('./crud_mongodb')(config.handler);
    } else if (config.handler.isPostgreSQL) {
        handler = require('./crud_postgresql')(config.handler);
    } else if (config.handler.isMongoPortable) {
        handler = require('./crud_mongo_portable')(config.handler);
    }
    // var mongoHandler = require('./crud_mongodb')(config.handler),
    //     postgreHandler = require('./crud_postgresql')(config.handler);

    return {
        search: function(filter, cb) {
            handler.search(filter, cb);
            // if (config.handler.isMongoDB) {
            //     mongoHandler.search(filter, cb);
            // } else if (config.handler.isPostgreSQL) {
            //     postgreHandler.search(filter, cb);
            // }
        },
        create: function(item, cb) {
            handler.create(item, cb);
            // if (config.handler.isMongoDB) {
            //     mongoHandler.create(item, cb);
            // } else if (config.handler.isPostgreSQL) {
            //     postgreHandler.create(item, cb);
            // }
        },
        update: function(item, cb) {
            handler.update(item, cb);
            // if (config.handler.isMongoDB) {
            //     mongoHandler.update(item, cb);
            // } else if (config.handler.isPostgreSQL) {
            //     postgreHandler.update(item, cb);
            // }
        },
        delete: function(items, cb) {
            handler.delete(items, cb);
            // if (config.handler.isMongoDB) {
            //     mongoHandler.delete(items, cb);
            // } else if (config.handler.isPostgreSQL) {
            //     postgreHandler.delete(items, cb);
            // }
        },
        export: function(items, cb) {
            handler.export(items, cb);
            // if (config.handler.isMongoDB) {
            //     mongoHandler.export(items, cb);
            // } else if (config.handler.isPostgreSQL) {
            //     postgreHandler.export(items, cb);
            // }
        },
        execute: function(query, cb) {
            handler.execute(query, cb);
            // if (config.handler.isMongoDB) {
            //     mongoHandler.execute(query, cb);
            // } else if (config.handler.isPostgreSQL) {
            //     postgreHandler.execute(query, cb);
            // }
        }
    };
};