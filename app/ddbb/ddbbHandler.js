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
        // Movement
        searchMovement: function(filter, cb) {
            handler.searchMovement(filter, cb);
        },
        createMovement: function(item, cb) {
            handler.createMovement(item, cb);
        },
        updateMovement: function(item, cb) {
            handler.updateMovement(item, cb);
        },
        deleteMovement: function(items, cb) {
            handler.deleteMovement(items, cb);
        },
        
        // Predefined Movements
        searchPredefined: function(filter, cb) {
            handler.searchPredefined(filter, cb);
        },
        searchPredefinedComboList: function(cb) {
            handler.searchPredefinedComboList(cb);
        },
        createPredefined: function(item, cb) {
            handler.createPredefined(item, cb);
        },
        updatePredefined: function(item, cb) {
            handler.updatePredefined(item, cb);
        },
        deletePredefined: function(items, cb) {
            handler.deletePredefined(items, cb);
        },
        
        // Exporting
        export: function(items, cb) {
            handler.export(items, cb);
        },
        exportPDF: function(init, end, cb) {
            handler.exportPDF(init, end, cb);
        },
        
        // Others
        execute: function(query, cb) {
            handler.execute(query, cb);
        }
    };
};