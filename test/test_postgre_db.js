var config = require('../app/ddbb/ddbbConfig')();

var expect = require('chai').expect,
    pg = require('pg'),
    handler = require('../app/ddbb/ddbbHandler.js')(config);
    
    
var filter = '{\"concept\": \"mocha\"}';
describe('Postgre SQL', function() {
    describe('Configuration', function() {
        it('should have the PG module', function() {
            expect(pg).to.not.be.null;
        });
        it('should have the config file', function() {
            expect(config).to.not.be.null;
            expect(config.handler).to.not.be.null;
        });
        it('should have the PostgreSQL Handler', function() {
            expect(handler).to.not.be.null;
        });
        it('should have a valid connection string', function() {
            expect(config.handler.getConnectionString()).to.have.length.above(0);
        });
    });

    describe('CRUD', function() {
        describe('Create', function() {
            it('should be able to create one', function(done) {
                var _new = {
                    date: '2000-12-31',
                    concept: 'mocha_new',
                    amount: 100
                };
                handler.create(_new, function(error, result) {
                    expect(error).to.be.null;
                    expect(result).to.not.be.null;

                    done();
                });
            });
        });
        describe('Read', function() {
            it('should be able to query all', function(done) {
                handler.search(null, function(error, result) {
                    expect(error).to.be.null;
                    expect(result).to.not.be.null;
                    expect(result).to.have.length.above(0);

                    done();
                });
            });
            it('should be able to query one', function(done) {
                handler.search(filter, function(error, result) {
                    expect(error).to.be.null;
                    expect(result).to.not.be.null;
                    expect(result).to.have.length(1);

                    done();
                });
            });
        });
        describe('Update', function() {
            it('should be able to update one', function(done) {
                handler.search(filter, function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.length(1);

                    var item = res[0];
                    item.date = '2000-12-31';
                    item.concept = 'mocha_update';
                    item.amount = 100;

                    handler.update(item, function(error, result) {
                        expect(error).to.be.null;
                        expect(result).to.not.be.null;

                        done();
                    });
                });
            });
        });
        describe('Delete', function() {
            it('should be able to delete one', function(done) {
                handler.search(filter, function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.length(1);

                    handler.delete(res, function(error, result) {
                        expect(error).to.be.null;
                        expect(result).to.not.be.null;

                        done();
                    });
                });
            });
        });
        describe('Execute', function() {
            it('should be able to execute a query', function(done) {
                var query = 'SELECT * FROM movimientos LIMIT 1';
                handler.execute(query, function(err, res) {
                    expect(err).to.be.null;
                    expect(res).to.have.length(1);
                    
                    done();
                });
            });
        });
    });
});
