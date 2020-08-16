var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var brandsc = new Schema({
    brand_id:Number,
    brand :String
});


var category=new Schema({

      
    category_id:Number,
    cname:String
    
});

var subcategory=new Schema({

    subcategory_id:Number,
    category_id:{type:Schema.Types.ObjectId,ref:"category"},
    scname:String
});

var product=new Schema({
    product_id:Number,
    pname:String,
    price:Number,
    quantity:Number,
    desc:String,
    imagename:String,
    warranty:Number,
    color:String,
    discount:Number,    
    brand_id:{type:Schema.Types.ObjectId,ref:"brand"},
    subcategory_id:{type:Schema.Types.ObjectId,ref:"subcategory"},

})

var cart=new Schema({

    cart_id:Number,
    product_id:{type:Schema.Types.ObjectId,ref:"product"},   
    subTotal:Number,
    qty:Number,
    price:Number,
    date: {
        type: Date,
        default: Date.now
      },
     Pstatus: {
        type: Boolean,
        required: true
    },
    Dstatus: {
        type: Boolean,
        required: true
     }
    });

var order=new Schema({

    order_id:Number,
    product_id:{type:Schema.Types.ObjectId,ref:"product"},
    TotalAmt:Number,


});



var feedback=new Schema({

    feedback_id:Number,
    product_id:{type:Schema.Types.ObjectId,ref:"product"},
    desc:String
});

// const UserSchema = new mongoose.Schema({
//     userid:{
//       type:Number
//     },
//     name: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true
//     },
//     password: {
//       type: String,
//       required: true
//     },
//     contact: {
//       type: Number,
//       required: true
//     },  
//     address: {
//       type: String,
//       required: true
//     },
//     type1:{
//       type:String
//     }, 
//     date: {
//       type: Date,
//       default: Date.now
//     }
//   });



const brandschema = mongoose.model('brand',brandsc);
const categoryschema = mongoose.model('category',category);
const subcategoryschema=mongoose.model('subcategory',subcategory);
const productschema=mongoose.model('product',product);
const cartschema=mongoose.model('cart',cart);
const orderschema=mongoose.model('order',order);
const feedbackschema = mongoose.model('feedback',feedback);


module.exports= { brandata : brandschema ,category:categoryschema,subcategory: subcategoryschema,product:productschema,cart1:cartschema,order:orderschema,feedback:feedbackschema}
