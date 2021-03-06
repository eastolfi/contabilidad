process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.DDBB_TYPE = process.env.DDBB_TYPE || 'postgreSQL';

var pg = require('pg'),
    dbConfig = require('../app/ddbb/ddbbConfig')().handler;
    
//var connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/contabilidad';

var connectionString = dbConfig.getConnectionString();

var client = new pg.Client(connectionString);

client.connect();

var query = client.query('ALTER TABLE movimientos ADD "order" INTEGER NOT NULL DEFAULT 0');

query.on('end', function() {
    client.end();
});