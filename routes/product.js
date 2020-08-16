const express = require('express');
const router = express.Router();
const User = require('../models/User');
var {category} = require('../schema/user');

var {product} = require('../schema/user');


router.get('/product', function(req, res, next) {
    product.find(function(err,product)
      {
        if(err)
        {
          console.log(err);
        }
        else{
          res.render('product',{product:product});

        }
      });
  });

  
  module.exports = router;