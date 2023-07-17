const express = require('express');
const router = express.Router();

const {
  getAllUser,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../controllers/userController');

router.route('/').get(getAllUser);

router.route('/showMe').get(showCurrentUser); // If it is below id route it will throw error that it can not find id

router.route('/updateUser').post(updateUser);
router.route('/updateUserPassword').post(updateUserPassword);

router.route('/:id').get(getSingleUser);

module.exports = router;
