const express = require('express');
const router = express.Router();

var { cart1 } = require('../schema/user');

var { order } = require('../schema/user');
var { feedback } = require('../schema/user');


// router.get('/cart', function (req, res, next) {
//   cart1.find().populate('product_id')

//     .exec()
//     .then(function (cart1) {
//       res.render('cart', { title: cart1, cart1: cart1 })
//     });
// });


router.get('/cart', function (req, res, next) {
  if (req.session.customerSession) {
    cart1.find(function (err, users) {
      if (err) {
        console.log(err);
      }
      else {
            cart1.find().populate('product_id')

        .exec()
        .then(function (cart1) {
          res.render('cart', { title: cart1, cart1: cart1  ,username: req.session.customerSession})
    });
      }
    });
  } else {
    res.redirect('/users/login');
  }
});



/* DELETE cart BY ID */
router.get('/deletecart/:id', function (req, res) {
  cart1.findByIdAndRemove(req.params.id, function (err, project) {
    if (err) {

      req.flash('error_msg', 'Record Not Deleted');
      res.redirect('../cart');
    } else {

      req.flash('success_msg', 'Record Deleted');
      res.redirect('../cart');
    }
  });
});

/* UPDATE cat */

router.post('/editcart/:id', function (req, res) {
  cart1.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if (err) {
      req.flash('error_msg', 'Something went wrong! User could not updated.');
      res.render('cart/cart');
    } else {
      req.flash('success_msg', 'Record Updated');
      res.render('cart/cart');
    }
  });
});


router.get('/cartincrement/:id', function (req, res, next) {
  console.log(req.params.id);
  cart1.findOne({ product_id: req.params.id }, function (err, cinc) {
    if (err) {
      console.log(err);
    } else {

      var a = cinc._id;
      var b = cinc.qty;
      var c = cinc.price;
      console.log("qtyy : " + b);
      console.log("pricee : " + c);


      const mubodydata = {
        qty: b + 1,
        subTotal: c * b

      }

      cart1.findByIdAndUpdate(a, mubodydata, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Done Successfully");
          res.redirect('../cart');
        }
      });

    }
  });
});



router.get('/cartminus/:id', function (req, res, next) {
  console.log(req.params.id);

  cart1.findOne({ product_id: req.params.id }, function (err, cinc) {
    if (err) {
      console.log(err);
    } else {
      var a = cinc._id;
      var b = cinc.qty;
      var c = cinc.price;

      const mubodydata = {
        qty: b - 1,
        subTotal: c * b
      }


      cart1.findByIdAndUpdate(a, mubodydata, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Done Successfully");
        }
      });

    }
  });

  
});



// view feedback


module.exports = router;
