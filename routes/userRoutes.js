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

router.route('/updateUser').patch(updateUser);
router.route('/updateUserPassword').patch(updateUserPassword);

router.route('/:id').get(authenticateUser, getSingleUser);

module.exports = router;
