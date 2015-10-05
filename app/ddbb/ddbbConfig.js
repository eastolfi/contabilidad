var mongoose = require('mongoose');

module.exports = function() {
    return {
        handler: {
            isMongoDB: process.env.DDBB_TYPE === 'mongoDB',
            isPostgreSQL: process.env.DDBB_TYPE === 'postgreSQL',
            getConnectionString: function() {
                var str = '';

                if (this.isMongoDB && process.env.NODE_ENV === 'development') {
                    mongoose.connect('mongodb://admin:admin@ds049161.mongolab.com:49161/contabilidad');
                }
                if (this.isMongoDB && process.env.NODE_ENV === 'production') {
                    mongoose.connect('mongodb://localhost/contabilidad');
                }
                if (this.isPostgreSQL && process.env.NODE_ENV === 'development') {
                    str = 'postgres://postgres:admin@localhost:5432/contabilidad';
                }
                if (this.isPostgreSQL && process.env.NODE_ENV === 'production') {
                    //str = 'postgres://postgres:admin@localhost:5432/contabilidad';
                }

                return str;
            }
        }
    };
};