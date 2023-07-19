const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
  // requestUser -> user which is logged in
  // resourceUserId -> ID which we are searching with
  // Both of these are object

  // If the user role is admin then return
  if (requestUser.role === 'admin') return;
  // If logged user ID is equal to entered ID then also return
  if (requestUser.userId === resourceUserId.toString()) return;

  // Throw error if user role is not admin and if user is searching with other user ID
  throw new CustomError.UnauthorizedError(
    'Not authorized to access this route'
  );
};

module.exports = {
  checkPermissions,
};
