const mongoose = require('mongoose');
var Schema=mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  contact: {
    type: Number,
    required: true
  },  
  address: {
    type: String,
    required: true
  },  
  type: {
    type: String,
    required: true
  },  
  date: {
    type: Date,
    default: Date.now
  }
});


//city field

// var citySchema =new Schema({
//   Srno:{type:Number,required:true},
//   cityName:{type:String,required:true}
// },{collection:'city'});

// var cityData=mongoose.model('cityData',citySchema);
UserSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


const User = mongoose.model('User', UserSchema);

module.exports = User;



