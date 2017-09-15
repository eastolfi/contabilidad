'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Article Schema
 */
var MovimientoSchema = new Schema({
    concept: {
        type: String
    },
    date: {
        type: Date
    },
    amount: {
        type: Number
    }
});

/**
 * Validations
 */
MovimientoSchema.path('amount').validate(function(title) {
    return title.length;
}, 'amount cannot be blank');


mongoose.model('Movimiento', MovimientoSchema);
