
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
var multer = require('multer');
var path = require('path');

var mongoose = require('mongoose');
// Load User model

const User = require('../models/User');
const { ensureAuthenticated,forwardAuthenticated } = require('../config/auth');

var {brandata} = require('../schema/user');
var {category} = require('../schema/user');
var {subcategory} = require('../schema/user');
var {product} = require('../schema/user');
var {cart1} = require('../schema/user');
var {feedback} = require('../schema/user');



// var imageData=UsersModel.find({});

router.use(express.static(__dirname+"./public/"));

var Storage=multer.diskStorage({
  destination:"./public/uplodes/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var uplode=multer({
  storage:Storage
}).single('file');

router.get('/users/home', function(req, res, next) {
    res.render('users/home');
  });



// Login Page
router.get('/login', (req, res) => res.render('login'));

//city field
// var Schema = mongoose.Schema;
// var citySchema =new Schema({
//   Srno:{type:Number,required:true},
//   cityName:{type:String,required:true}
// },{collection:'city'});

// var cityData=mongoose.model('cityData',citySchema);


// Register Page
router.get('/register',function(req, res, next) {
  res.render('register',{success:''});
});
// router.get('/register',forwardAuthenticated, function(req, res) {
//   cityData.find(function(err, doc1) { 
//       res.render('register', {itemscity:doc1});
//   });
// });



// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2, contact,address} = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !contact || !address) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
      contact,
      
      address
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
          contact,
          
          address  
           });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          contact,
          
          address,
          
          type:"customer"
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});



//Display Form 
router.get('/addAdmin',function(req, res, next) {
  if (req.session.adminSession) {
    res.render('adminRegistration', { username: req.session.adminSession});
  } else {
    res.redirect('/users/login');
  }
}); 




/* POST Data.  add admiPn
*/
// Register
router.post('/addAdmin', (req, res) => {
  const { name, email, password, password2, contact,address} = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !contact || !address) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('adminRegistration', {
      errors,
      name,
      email,
      password,
      password2,
      contact,
      
      address
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('adminRegistration', {
          errors,
          name,
          email,
          password,
          password2,
          contact,
          
          address    
           });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          contact,
          address,
          type:"admin"
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/displayAdmin');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

var name1,address,contact,name2;
router.get('/profile',function(req,res,next){
  
});

// Login
router.post('/login', function (req, res, next) {
  var uname = req.body.email;
  
  console.log(uname);
  console.log(req.body.password);

  User.findOne({ email: req.body.email })
    .then(doc => {
      if (!doc.validPassword(req.body.password)) {
        res.status(304).redirect('login');
        return;
      }
      else {
        var role = doc.type;
       
        console.log("Type of user : "+role);
        if(role == "admin"){
          name2=doc.name;
          req.session.adminSession = req.body.email;
          console.log("Type of user : Admin  "+req.session.adminSession);
          res.render('dashboard');
        }
        if(role == "customer"){
          name1=doc.name;
          address1=doc.address;
          contact1=doc.contact;
          req.session.customerSession = req.body.email;
          console.log("Type of user : Customer  "+req.session.customerSession+name1+address1);
          res.render('custHomepage');
        }
        
        // req.session.facultySession = req.body.email;
        // req.session.facultyID = doc._id;
        // console.log("Session Data : " + req.session.facultySession + " Faculty  id : " + req.session.facultyID);
        // res.status(304).redirect('/faculty/dashboard');
        
        return;
      }

    })
    .catch(err => {
      console.log("\n Faculty login unsuccess " + err);
      // student_login(req, res);
    });
});


//
router.get('/profile',function(req,res,next){
  var username=req.user.name;
  var usertype=req.user.type;


  if(usertype=="customer"){
    res.render('custHome',{username:username})
  }
  if(usertype=="admin"){
    res.render('dashboard',{username:username})
  }
  
});

// Logout

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

router.get('/display', function(req, res) {
  brandata.find(function(err, users) { 
   
      if (req.session.adminSession) {
        res.render('display-table', { username: req.session.adminSession,records:users,users:users});
      } else {
        res.redirect('/users/login');
      }
  });
});




//Display Form 

router.get('/add-form',function(req, res, next) {
  if (req.session.adminSession) {
    res.render('add-form', { username: req.session.adminSession});
  } else {
    res.redirect('/users/login');
  }
}); 


/* POST Data. 
*/
router.post('/add-form',function(req, res, next) {
  console.log(req.body);

  const mybodydata={
    brand_id:1,
    brand:req.body.brand
  }
  var data=brandata(mybodydata);

  data.save(function(err){

    res.redirect('display');
  })
});




//Display category Form 

// router.get('/displayCategory', function (req, res, next) {
//   if (req.session.adminSession) {
//     res.render('displayCategory', { username: req.session.adminSession,cate:users});
//   } else {
//     res.redirect('/users/login');
//   }
// });


router.get('/displayCategory', function(req, res) {
  category.find(function(err, users) { 
    if (req.session.adminSession) {
          res.render('displayCategory', { username: req.session.adminSession,cate:users});
        } else {
          res.redirect('/users/login');
        }
      // res.render('displayCategory', {cate:users});
  });
});

/* POST Data. 
*/

router.get('/addCategory', function(req, res) {
  category.find(function(err, users) { 
    if (req.session.adminSession) {
          res.render('addCategory', { username: req.session.adminSession,cate:users});
        } else {
          res.redirect('/users/login');
        }
      // res.render('displayCategory', {cate:users});
  });
});

router.post('/addCategory',function(req, res, next) {
  console.log(req.body);

  const mybodydata={
    category_id:1,
    cname:req.body.cname
  }
  var data=category(mybodydata);

  data.save(function(err){
    res.redirect('displayCategory');
  })
});


/* DELETE cat BY ID */
// router.get('/deletecat/:id', ensureAuthenticated,function(req, res) {
//   category.findByIdAndRemove(req.params.id, function(err, project) {
//       if (err) {

//           req.flash('error_msg', 'Record Not Deleted');
//           res.redirect('../displayCategory');
//       } else {

//           req.flash('success_msg', 'Record Deleted');
//           res.redirect('../displayCategory');
//       }
//   });
// });


/* GET SINGLE cat BY ID */
router.get('/editcat/:id',function(req, res) {
  console.log(req.params.id);
  category.findById(req.params.id, function(err, user) {
      if (err) {
          console.log(err);
      } else {
          console.log(user);
          if (req.session.adminSession) {
            res.render('editCategory', { username: req.session.adminSession,cat: user});
          } else {
            res.redirect('/users/login');
          }
      }
  });
});


/* UPDATE cat */
router.post('/editcat/:id',function(req, res) {
  category.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) {
          req.flash('error_msg', 'Something went wrong! User could not updated.');
          res.redirect('editcat/' + req.params.id);
      } else {
          req.flash('success_msg', 'Record Updated');
          res.redirect('../displayCategory');
      }
  });
});

//Add product Page Show
router.get('/addProduct', function(req, res, next) {
  brandata.find(function(err,brand)
    {
      if(err)
      {
        console.log(err);
      }
      else{
        subcategory.find(function(err,subcategory)
        {
          if(err)
          {
            console.log(err);
          }
          else{
            if (req.session.adminSession) {
              res.render('addProduct', { username: req.session.adminSession,brand:brand,subcategory:subcategory});
            } else {
              res.redirect('/users/login');
            }
              

          }
        });
      }
    });
});





// add product
router.post('/uplode',uplode,function(req, res, next) {
  var imageFile=req.file.filename;
  var success=req.file.filename + "uplode successfully";

  var imageDetails= new product({
    product_id:1,
    pname: req.body.pname,
    price: req.body.price,
    quantity: req.body.quantity,
    desc: req.body.desc,
    imagename:imageFile,
    warranty:req.body.warranty,
    color:req.body.color,
    discount:req.body.discount, 
    brand_id:req.body.brand_id,
    subcategory_id:req.body.subcategory_id
  }); 
  imageDetails.save(function(err,users){
    if(err) throw err;
    res.render('addProduct', {success:success,brand:users,subcategory:users});
  });
});



// //View product


router.get('/displayProduct', function (req, res, next) {
  if (req.session.adminSession) {
    product.find().populate('subcategory_id','scname')
    .populate('brand_id','brand')  
    .exec()
    .then(function(product){
      res.render('displayProduct',{product:product,username: req.session.adminSession})
    });
    
  } else {
    res.redirect('/users/login');
  }
});

// deleteprroduct

router.get('/deleteprod/:id',function(req, res) {
  product.findByIdAndRemove(req.params.id, function(err, project) {
      if (err) {

          req.flash('error_msg', 'Record Not Deleted');
          res.redirect('../displayProduct');
      } else {

          req.flash('success_msg', 'Record Deleted');
          res.redirect('../displayProduct');
      }
  });
});


/* GET product BY ID */



router.get('/editprod/:id', function (req, res, next) {
  if (req.session.adminSession) {
    product.findById(req.params.id)
    .then(function (docs) {
      subcategory.findById(req.params.id) //aa data bija table
                                              //  NA 6E      
        .then(function (docs1) {
          subcategory.find()
            .then(function (docs2) {
              res.render('editProd', { item: docs, items: docs1, item2: docs2,username: req.session.adminSession });
            });
        });
    });
  } else {
    res.redirect('/users/login');
  }
}); 

/* UPDATE prod */

router.post('/editprod/:id',function(req, res) {
  product.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) {
          req.flash('error_msg', 'Something went wrong! User could not updated.');
          res.redirect('editprod/' + req.params.id);
          console.log("error is-----------"+err);
      } else {
          req.flash('success_msg', 'Record Updated');
          res.redirect('../displayProduct');
      }
  });
});



/* DELETE brand BY ID */
router.get('/delete/:id', ensureAuthenticated,function(req, res) {
  brandata.findByIdAndRemove(req.params.id, function(err, project) {
      if (err) {

          req.flash('error_msg', 'Record Not Deleted');
          res.redirect('../display');
      } else {

          req.flash('success_msg', 'Record Deleted');
          res.redirect('../display');
      }
  });
});

/* GET SINGLE User BY ID */
router.get('/edit/:id',function(req, res) {
  console.log(req.params.id);
  brandata.findById(req.params.id, function(err, user) {
      if (err) {
          console.log(err);
      } else {
          console.log(user);

          res.render('edit-form', { users: user });
      }
  });
});



/* UPDATE User */
router.post('/edit/:id',function(req, res) {
  brandata.findByIdAndUpdate(req.params.id, req.body, function(err) {
      if (err) {
          req.flash('error_msg', 'Something went wrong! User could not updated.');
          res.redirect('edit/' + req.params.id);
      } else {
          req.flash('success_msg', 'Record Updated');
          res.redirect('../display');
      }
  });
});






router.get('/addCategory', ensureAuthenticated,function(req, res, next) {
  res.render('addCategory');
});


//Add Category Page Show

router.get('/addsubcategory', function(req, res) {
  category.find(function(err, users) { 
    if (req.session.adminSession) {
          res.render('addsubcategory', { username: req.session.adminSession,cate:users});
        } else {
          res.redirect('/users/login');
        }
      // res.render('displayCategory', {cate:users});
  });
});



//Add Subcategory

router.post('/addSubcategory',function(req, res, next) {
  console.log(req.body);

  const sub={
    subcategory_id:1,
    category_id:req.body.category_id,
    scname:req.body.scname
    
  }
  var data=subcategory(sub);

  data.save(function(err,users){
    res.render('addSubcategory',{cate:users});
  })
});



// //View subcategory


router.get('/displaySubcategory', function(req, res, next) {
  if (req.session.adminSession) {
    subcategory.find().populate('category_id','cname')
    .exec()
    .then(function(users){
      res.render('displaySubcategory',{subcategory:users,username: req.session.adminSession})
    });
   
  } else {
    res.redirect('/users/login');
  }
});



router.get('/addsubcategory', function(req, res) {
  category.find(function(err, users) { 
    if (req.session.adminSession) {
          res.render('addsubcategory', { username: req.session.adminSession,cate:users});
        } else {
          res.redirect('/users/login');
        }
      // res.render('displayCategory', {cate:users});
  });
});


router.get('/editsubcat/:id', function (req, res, next) {
  if (req.session.adminSession) {
    subcategory.findById(req.params.id)
    .then(function (docs) {
      category.findById(req.params.id) //aa data bija table
                                              //  NA 6E      
        .then(function (docs1) {
          category.find()
            .then(function (docs2) {
              res.render('editSubCategory', { username: req.session.adminSession,item: docs, items: docs1, item2: docs2 });
            });
        });
    });
  } else {
    res.redirect('/users/login');
  }
});




router.post('/editsubcat/:id',function(req, res) {
    subcategory.findByIdAndUpdate(req.params.id, req.body, function(err) {
        if (err) {
            req.flash('error_msg', 'Something went wrong! User could not updated.');
            res.redirect('editsubcat/' + req.params.id);
        } else {
            req.flash('success_msg', 'Record Updated');
            res.redirect('../displaySubcategory');
        }
    });
  });




router.get('/dashboard', function (req, res, next) {
  if (req.session.adminSession) {
    res.render('dashboard', { username: req.session.adminSession});
  } else {
    res.redirect('/users/login');
  }
});



router.get('/displayAdmin', function(req, res) {
  User.find(function(err, admin) { 
      if (req.session.adminSession) {
        res.render('displayAdmin', { username: req.session.adminSession,admin:admin});
      } else {
        res.redirect('/users/login');
      }
  });
});
// Admin


router.get('/displayFeedbackAdmin', function (req, res, next) {
  if (req.session.adminSession) {
    feedback.find().populate('product_id')

  .exec()
  .then(function(f){
    res.render('displayFeedbackAdmin',{f:f,username: req.session.adminSession})
  });
  } else {
    res.redirect('/users/login');
  }
});



 
router.get('/viewOrdersAdmin', function (req, res, next) {
  if (req.session.adminSession) {
    cart1.find().populate('product_id')

    .exec()
    .then(function(order){
      res.render('viewOrdersAdmin', { username: req.session.adminSession,order:order});
        });
    
  } else {
    res.redirect('/users/login');
  }
});



router.get('/header', function (req, res, next) {
  if (req.session.adminSession) {
    res.render('header', { username: req.session.customerSession});
  } else {
    res.redirect('/users/login');
  }
});

router.get('/bill', function (req, res, next) {
  cart1.find().populate('product_id')
  // .populate('email')

    .exec()
    .then(function (cart1) {
      res.render('bill', { title: cart1, cart1: cart1 })
    });
});


//Payment Status update 
router.get('/statusDone/:id', function (req, res, next) {
  cart1.findOneAndUpdate({ _id: req.params.id }, { Pstatus: false }, { new: true }, function (err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
  });
  res.redirect('../viewOrdersAdmin');

});
router.get('/statusPending/:id', function (req, res, next) {
  cart1.findOneAndUpdate({ _id: req.params.id }, { Pstatus: true }, { new: true }, function (err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
  });
  res.redirect('../viewOrdersAdmin');

});

// Delivery Status update 
router.get('/statusD/:id', function (req, res, next) {
  cart1.findOneAndUpdate({ _id: req.params.id }, { Dstatus: false }, { new: true }, function (err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
  });
  res.redirect('../viewOrdersAdmin');

});
router.get('/statusP/:id', function (req, res, next) {
  cart1.findOneAndUpdate({ _id: req.params.id }, { Dstatus: true }, { new: true }, function (err, doc) {
    if (err) {
      console.error('error, no entry found');
    }
  });
  res.redirect('../viewOrdersAdmin');

});



// router.get('/displayFeedback', function(req, res, next) {
//   feedback.find().populate('product_id')

//   .exec()
//   .then(function(f){
//     res.render('displayFeedback',{f:f})
//   });
// });



router.get('/displayFeedback', function (req, res, next) {
  if (req.session.customerSession) {
    feedback.find(function (err) {
      if (err) {
        console.log(err);
      }
      else {
        feedback.find().populate('product_id')

        .exec()
        .then(function(f){
          res.render('displayFeedback',{f:f ,username: req.session.customerSession})
        });
           
  
      }
    });
  } else {
    res.redirect('/users/login');
  }
});



router.get('/checkout', function (req, res, next) {
  if (req.session.customerSession) {
    
    res.render('checkout', { email: req.session.customerSession,username:name1,contact:contact1,address:address1});
  } 
  
  else {
    res.redirect('/users/login');
  }
});



// router.get('/checkout', function (req, res, next) {
//   cart1.find().populate('product_id')

//     .exec()
//     .then(function (cart1) {
//       res.render('checkout', { title: cart1, cart1: cart1 })
//     });
// });




router.get('/contactus', function (req, res, next) {
  
    
    res.render('contactus', { username: req.session.customerSession});


});


module.exports = router;



