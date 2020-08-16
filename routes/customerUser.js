const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

var UsersModel = require('../schema/user');

var { category } = require('../schema/user');
var { product } = require('../schema/user');
var { subcategory } = require('../schema/user');
var { cart1 } = require('../schema/user');
var { order } = require('../schema/user');

var { feedback } = require('../schema/user');

// router.get('/custHomepage', ensureAuthenticated, function (req, res, next) {
//   res.render('custHomepage');
// });

router.get('/custHomepage', function (req, res, next) {

    res.render('custHomepage', { username: req.session.customerSession});
 
});





router.get('/displayFeedback', function(req, res, next) {
  
});

// router.get('/viewAllCustFeedback', function (req, res, next) {
//   if (req.session.customerSession) {
//     res.render('viewAllCustFeedback', { username: req.session.customerSession});
//   } else {
//     res.redirect('/users/login');
//   }
// });

// // router.get('/displayFeedbackAdmin', function(req, res, next) {
// //   feedback.find().populate('product_id')

// //   .exec()
// //   .then(function(f){
// //     res.render('displayFeedbackAdmin',{f:f})
// //   });
// // });

router.get('/viewcategory', function (req, res, next) {
  category.find(function (err, category) {
    if (err) {
      console.log(err);
    }
    else {
      res.render('viewcategory', { category: category })

    }
  });
});


router.get('/custProduct', function (req, res, next) {
  category.find(function (err, category) {
    if (err) {
      console.log(err);
    }
    else {
      subcategory.find()
        // .populate('category_id')
        .exec(function (err, subcategory) {
          if (err) {
            console.log(err);
          }
          else {
            product.find()
              .populate('brand_id')
              .exec(function (err, product) {
                if (err) {
                  console.log(err);
                }
                else {
                  res.render('custProduct', { category: category, product: product, subcategory: subcategory ,username: req.session.customerSession});

                }
              });

          }
        });
    }
  });

});


// get paeticular category
router.get('/getcate/:id', function (req, res) {
  // console.log();
  var categoryID = req.params.id;
  // res.render('custProduct', { categoryID : req.params.id });
  category.find({ _id: categoryID }, function (err, category) {
    if (err) {
      console.log(err);
    }
    else {

      subcategory.find()
        // .populate('category_id')
        .exec(function (err, subcategory) {
          if (err) {
            console.log(err);
          }
          else {
            product.find()
               .populate('brand_id')
              .exec(function (err, product) {
                if (err) {
                  console.log(err);
                }
                else {
                  res.render('custProduct', { category: category, product: product, subcategory: subcategory });
                  // res.render('custProduct', { });
                }
              });

          }
        });
    }
  });
});



// //View product
router.get('/:id', function (req, res, next) {
  console.log("ID : " + req.params.id);
  product.findById(req.params.id).populate('subcategory_id', 'scname')
    .populate('brand_id', 'brand')
    .exec()
    .then(function (product) {
      res.render('zoomProduct', { product: product,username: req.session.customerSession })
    });
});



// get id for product cart
router.post('/:id', function (req, res) {
  // console.log("IDDDDDDDDDDD : "+req.params.id);
 var hiddenprice = req.body.hiddenprice;
 var hiddenqty= req.body.cart_qty;
  console.log("price : "+hiddenprice);
   console.log("qty : "+hiddenqty);
   var sub=hiddenprice * hiddenqty ;
   console.log("sub : "+sub);


// console.log("ID : " + req.params.id +"and :"+hiddenId + " Cart : " + req.body.cart_qty );
product.findById(req.params.id, function (err, product) {
  if (err) {
    console.log(err);
  } else {
    const mybodydata = {  
      cart_id: 1,       
      product_id: req.params.id,
      subTotal: sub,
      qty: req.body.cart_qty,
      price:hiddenprice,
     Pstatus: 0,
     Dstatus: 0

    }
    // console.log("subtotal : "+req.body.subTotal);
    // console.log("ID : " + req.params.id + " Cart : " + req.body.cart_qty + "Cart data : " + mybodydata);
    var data = cart1(mybodydata);
   
    data.save(function (err) {

      res.render('zoomProduct', { product: product,username:req.session.customerSession });
    });

  }
 });

});


// order tabe insert
// router.get('/checkout/:id', function (req, res, next) {
//   cart1.find(function (err, category) {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       res.render('cart', { c: c })

//     }
//   });
// });


// router.post('/checkout/:id',function(req, res, next) {
//   console.log(req.body);
//   var hidden= req.body.cart_qty;
//  console.log("hiddenid" +hidden);
//   const order={
//     order_id:1,
//     cart_id:req.body.cart_id
  
    
//   }
  // var data=order(order);

  // data.save(function(err,users){
  //   res.render('addSubcategory',{cate:users});
  // })

// });


// router.get('/custHomepage', function (req, res, next) {
//   if (req.session.customerSession) {
//     res.render('custHomepage', { username: req.session.customerSession});
//   } else {
//     res.redirect('/users/login');
//   }
// });   

router.get('/f/:id',function(req, res) {
  console.log(req.params.id);
  product.findById(req.params.id, function(err, user) {
      if (err) {
          console.log(err);
      } else {
          console.log(user);

          res.render('custFeedback');
      }
  });
});



router.post('/f/:id', function (req, res) {
  if (req.session.customerSession) {

product.findById(req.params.id, function (err, product) {
  if (err) {
    console.log(err);
  } else {
    const mybodydata = {  
      feedback_id: 1,       
      product_id: req.params.id,
      desc: req.body.desc
   
    }
    var data = feedback(mybodydata);
   
    data.save(function (err) {

      res.render('custFeedback', { product: product });
    });
  }
 });
} else {
  res.redirect('/users/login');
}
});


module.exports = router;