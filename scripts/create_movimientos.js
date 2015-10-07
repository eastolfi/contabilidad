var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:admin@localhost:5432/contabilidad';

var client = new pg.Client(connectionString);

client.connect();

var query = client.query('CREATE TABLE movimientos(_id SERIAL PRIMARY KEY, date DATE, concept VARCHAR(40) not null, amount INTEGER not null)');

query.on('end', function() {
    client.end();
});