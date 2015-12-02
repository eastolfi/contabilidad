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
                    var _host = 'ec2-54-247-170-228.eu-west-1.compute.amazonaws.com';
                    var _port = '5432';
                    var _db = 'dahrh9sqddtae';  //d1fhnj5hqlljv3
                    var _credentials = 'uvbvqpqbfynwux:_WmUaQKnLeCiwN75gsaXF1au5o';     //kjfzksezxibswp:xBUoEJ2RNDJLCZZa8OhU1-Sqff
                    var _ssl = 'ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory';
                    
                    str = 'postgres://' + _credentials + '@' + _host + ':' + _port + '/' + _db + '?' + _ssl;
                }

                return str;
            }
        }
    };
};