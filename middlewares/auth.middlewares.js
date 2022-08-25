const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { promisify } = require('util');

// Models
const { User } = require('../models/users.model');

// Utils
const { AppError } = require('../util/AppError');
const { catchAsync } = require('../util/catchAsync');

dotenv.config({ path: './config.env' });

exports.validateSession = catchAsync(async (req, res, next) => {
  // Extract token from headers
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Bearer token123.split(' ') -> [Bearer, token123]
    token = req.headers.authorization.split(' ')[1];
  }

  //console.log( token )
  if (!token) {
    return next(new AppError(401, "The token wasn't delivery, please add it")); // : "There isn't any delivered header, please verify it"
  }

  // Verify that token is still valid
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // Validate that the id the token contains belongs to a valid user
  // SELECT id, email FROM users;
  const user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: { id: decodedToken.id, status: 'active' }
  });

  if (!user) {
    return next(new AppError(401, 'User not found'));
  }

  //req.anyName = anyValue
  req.currentUser = user;

  // Grant access
  next();
});

//----------------------------------------------------------------------------

exports.userAdmin = catchAsync(async (req, res, next) => {
  if (req.currentUser.role !== 'admin') {
    return next(new AppError(403, 'Access denied'));
  }

  next();
});

//----------------------------------------------------------------------------

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { currentUser } = req;

  if (currentUser.id !== +id) {
    return next(
      new AppError(403, `You can't update/delete other users accounts`)
    );
  }

  next();
});