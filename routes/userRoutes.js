const express = require('express');
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication');

const {
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

// Authenticate the user then check its role (i.e admin)
router.route('/').get(authenticateUser, authorizePermissions('admin', 'owner'), getAllUser);

// Authenticate the user checked if it logged in or not
router.route('/showMe').get(authenticateUser, showCurrentUser); // If it is below id route it will throw error that it can not find id

// Authenticate the user checked if it logged in and then update user
router.route('/updateUser').patch(authenticateUser, updateUser);

// Only Logged in user can changed the password
router.route('/updateUserPassword').patch(authenticateUser,updateUserPassword);
 
// Authenticate the user can only see the user
router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
