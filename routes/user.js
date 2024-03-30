const express = require('express');
const router = express.Router(  );
const { isLoggedIn , customRole} = require('../middlewares/user');


const { signup, login, logout, forgetPassword,
     resetPassword, userProfile,  changePassword,
     updateProfile, adminAllUsers,
        managerAllUsers, adminGetOneUser, adminUpdateUser, adminDeleteUser
     } = require('../controllers/userController');


router.route('/signup').post(signup);

router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgetpassword').post(forgetPassword);
router.route('/resetpassword/:token').post(resetPassword);
router.route('/userProfile').get(isLoggedIn,userProfile);
router.route('/changePassword').put(isLoggedIn,changePassword);
router.route('/updateProfile').put(isLoggedIn,updateProfile);


router.route('/admin/users').get(isLoggedIn, customRole("admin"), adminAllUsers);
router.route('/admin/user/:id').get(isLoggedIn, customRole("admin"), adminGetOneUser).put(isLoggedIn, customRole("admin"), adminUpdateUser).delete(isLoggedIn, customRole("admin"), adminDeleteUser);

router.route('/manager/users').get(isLoggedIn, customRole("manager"), managerAllUsers);




module.exports = router;
// Compare this snippet from routes/user.js: