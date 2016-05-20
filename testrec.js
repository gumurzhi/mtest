var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// define the schema for our user model
var testRec = new Schema({
    rec: Number,
    name: String
});
module.exports = mongoose.model('testRec', testRec);
