const { Cart } = require('../models/carts.model');
const { Hotel } = require('../models/hotel.model');

const { AppError } = require('../util/AppError');
const { catchAsync } = require('../util/catchAsync');

exports.cartExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const cart = await Cart.findOne({
    where: { id, status: 'active' },
    include: [
      {
        model: Hotel,
        through: { where: { status: 'active' } }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(404, 'No cart found with that ID'));
  }
  req.cart = cart;
  next();
});