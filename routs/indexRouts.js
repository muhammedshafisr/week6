const express = require('express');

const router = express.Router();

const loginController = require('../Controllers/loginController');

const signupController = require('../Controllers/signupController')

const adminController = require('../Controllers/adminPanelController')

    // login routs 
router.get('/',loginController.reqforHome);
router.post('/login',loginController.checkingforLogin);
router.get('/home',loginController.home);
router.get('/logout',loginController.logout);

    // signup routs 
router.get('/signup',signupController.signupPage);
router.post('/validateSignup',signupController.signupValidation);

    // admin routes 
router.get('/admin',adminController.adminLogin);
router.post('/adminpanel',adminController.adminpage);
router.get('/userdata',adminController.userData);
router.get('/products',adminController.products);
router.get('/:id',adminController.deleteUser);
router.get('/admin/addproducts',adminController.getaddProducts);
router.get('/admin/userdata',adminController.admin_userData);
router.get('/admin/products',adminController.admin_addproduct);
router.post('/adminlogin',adminController.adminValidation);
router.post('/admin/addproducts',adminController.addProducts);
router.get('/admin/logout',adminController.logOut);
router.get('/userdata/useredit/:id',adminController.useredit);
router.post('/userdata/useredit/edit:id',adminController.usereditConfirm);

module.exports = router;