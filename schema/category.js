var mongoose = require('mongoose');



var Schema = mongoose.Schema,

ObjectId = Schema.ObjectId;

var uplodeSchena = new Schema({
cname :String,

});


module.exports = mongoose.model('category', uplodeSchena);

