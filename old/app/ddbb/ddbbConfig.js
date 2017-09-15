var mongoose = require('mongoose');

var ddbbType = process.env.DDBB_TYPE || 'postgreSQL';
var nodeEnv = process.env.NODE_ENV || 'development';

module.exports = function() {
    return {
        handler: {
            isMongoDB: ddbbType === 'mongoDB',
            isPostgreSQL: ddbbType === 'postgreSQL',
            isMongoPortable: ddbbType === 'mongoPortable',
            getConnectionString: function() {
                var str = '';

                if (this.isMongoDB && nodeEnv === 'development') {
                    mongoose.connect('mongodb://admin:admin@ds049161.mongolab.com:49161/contabilidad');
                }
                if (this.isMongoDB && nodeEnv === 'production') {
                    mongoose.connect('mongodb://localhost/contabilidad');
                }
                if (this.isPostgreSQL && nodeEnv === 'development') {
                    var _host = 'ec2-46-137-72-123.eu-west-1.compute.amazonaws.com';
                    var _port = '5432';
                    var _db = 'dahrh9sqddtae';  //d1fhnj5hqlljv3
                    var _credentials = 'uvbvqpqbfynwux:_WmUaQKnLeCiwN75gsaXF1au5o';     //kjfzksezxibswp:xBUoEJ2RNDJLCZZa8OhU1-Sqff
                    var _ssl = 'ssl=true&sslfactory=org.postgresql.ssl.NonValidatingFactory';

                    str = 'postgres://' + _credentials + '@' + _host + ':' + _port + '/' + _db + '?' + _ssl;
                }
                if (this.isPostgreSQL && nodeEnv === 'production') {
                    var _host = 'ec2-46-137-72-123.eu-west-1.compute.amazonaws.com';
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