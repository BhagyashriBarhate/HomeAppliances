const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/',  (req, res) => res.render('custHomepage'));

// // Dashboard
// router.get('/dashboard', ensureAuthenticated, (req, res) =>
//   res.render('dashboard', {
//     user: req.user
//   })
// );

router.get('/profile',function(req,res,next){
  var username=req.user.name;
  var usertype=req.user.type;


  if(usertype=="customer"){
    res.render('custHomepage',{username:username})
  }
  if(usertype=="admin"){
    res.render('dashboard',{username:username})
  }
  
});

module.exports = router;

