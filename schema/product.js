

var mongoose = require('mongoose');



var Schema = mongoose.Schema,

ObjectId = Schema.ObjectId;

var uplodeSchena = new Schema({
    pname :String,
    price:Number,
    quantity:Number,
    desc:String,
    imagename :String   
    
    });
    
    
    module.exports = mongoose.model('product', uplodeSchena);