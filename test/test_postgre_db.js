var config = {
    getConnectionString: function() {
        return 'postgres://postgres:admin@localhost:5432/contabilidad';
    }
};

var _id = 13;

var expect = require('chai').expect,
    pg = require('pg'),
    handler = require('../app/ddbb/crud_postgresql')(config);

describe('Postgre SQL', function() {
    describe('Configuration', function() {
        it('should have the PG module', function() {
            expect(pg).to.not.be.null;
        });
        it('should have the PostgreSQL Handler', function() {
            expect(handler).to.not.be.null;
        });
        it('should have a valid connection string', function() {
            expect(config.getConnectionString()).to.have.length.above(0);
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
                var filter = 'mocha';
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
                var item = {
                    id: 10,
                    date: '2000-12-31',
                    concept: 'mocha_update',
                    amount: 100
                };
                handler.update(item, function(error, result) {
                    expect(error).to.be.null;
                    expect(result).to.not.be.null;

                    done();
                });
            });
        });
        describe('Delete', function() {
            it('should be able to delete one', function(done) {
                var moves = ['{"_id": 12}'];
                handler.delete(moves, function(error, result) {
                    expect(error).to.be.null;
                    expect(result).to.not.be.null;

                    done();
                });
            });
        });
    });
});
