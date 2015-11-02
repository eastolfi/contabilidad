process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.DDBB_TYPE = process.env.DDBB_TYPE || 'postgreSQL';

var pg = require('pg'),
    dbConfig = require('../app/ddbb/ddbbConfig')().handler;
    
var connectionString = dbConfig.getConnectionString();

var client = new pg.Client(connectionString);

client.connect();

var sql = '' +
    ' CREATE OR REPLACE FUNCTION smart_replace_type() ' +
    ' RETURNS void AS $$ ' +
    '  ' +
    '   DECLARE ' +
    '   v_movimiento movimientos%ROWTYPE; ' +
    '   v_concepto VARCHAR; ' +
    ' BEGIN ' +
    '   FOR v_movimiento IN SELECT * FROM movimientos WHERE type = \'Valor\' LOOP ' +
    '       v_concepto := LOWER(v_movimiento.concept); ' +
    '  ' +
    '       UPDATE movimientos SET type = \'Otros\' WHERE _id = v_movimiento._id; ' +
    '  ' +
    '       IF v_concepto LIKE \'%alquiler%\' OR v_concepto LIKE \'%navigo%\' OR v_concepto LIKE \'%free%\' OR v_concepto LIKE \'%luz%\' OR v_concepto LIKE \'%internet%\' THEN ' +
    '           UPDATE movimientos SET type = \'Casa / Fijos\' WHERE _id = v_movimiento._id; ' +
    '       END IF; ' +
    '  ' +
    '       IF v_concepto LIKE \'%leader%\' OR v_concepto LIKE \'%carrefour%\' THEN ' +
    '           UPDATE movimientos SET type = \'Compras\' WHERE _id = v_movimiento._id; ' +
    '       END IF; ' +
    '  ' +
    '       IF v_concepto LIKE \'%cena%\' OR v_concepto LIKE \'%cafe%\' OR v_concepto LIKE \'%café%\' OR v_concepto LIKE \'%bar%\' OR v_concepto LIKE \'%cerveza%\' OR v_concepto LIKE \'%comida%\'  THEN ' +
    '           UPDATE movimientos SET type = \'Cenas / Bares\' WHERE _id = v_movimiento._id; ' +
    '       END IF; ' +
    '   END LOOP; ' +
    ' END; ' +
    '  ' +
    ' $$ LANGUAGE plpgsql; ';


var query = client.query(sql);

query.on('end', function() {
    client.end();
});