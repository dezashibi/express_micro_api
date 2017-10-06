let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let mongooseUniqueValidator = require('mongoose-unique-validator');

let schema = new Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    type: {type: String},
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);