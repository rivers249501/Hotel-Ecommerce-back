//models
const { Cart } = require('../models/carts.model');
const { Hotel } = require('../models/hotel.model');
const { HotelInCart } = require('../models/hotelInCart.model');
const { Order } = require('../models/orders.model');

//sequelize
const { Op } = require('sequelize');

// utils
const { catchAsync } = require('../util/catchAsync');
const { AppError } = require('../util/AppError');

exports.getAllCart = catchAsync(async (req, res, next) => {
  const cart = await Cart.findAll({
    where: { status: 'active' },
    include: [
      {
        model: Hotel,
        through: { where: { status: 'active' } }
      }
    ]
  });

  if (cart.length === 0) {
    return next(new AppError(404, 'There are not hotel create in cart'));
  }
});

exports.getCartByUser = catchAsync(async (req, res, next) => {
  const { cart } = req;

  // Check if hotel to add, does not exceeds that requested amount
  const hotel = await Hotel.findOne({
    where: { status: 'active', id: hotelId }
  });
});

exports.addProduct = catchAsync(async (req, res, next) => {
  const { hotelId, quantity } = req.body;
  const { currentUser } = req;

  //1. Find a hotel with userId from token and status "active"
  const hotel = await Hotel.findOne({
    where: { [Op.and]: [{ id: hotelId, status: 'active' }] }
  });

  if (!hotel)
    return next(
      new AppError(400, `Hotel id ${currentUser.id} does not exist`)
    );

  if (quantity > hotel.quantity) {
    return next(
      new AppError(400, `This hotel only has ${hotel.quantity} items.`)
    );
  }

  //const hotel = await Hotel.findAll({
  //  where: {
  //    [Op.and]: [{ status: 'active', id: hotelId }],
  //    quantity: {
  //      [Op.gte]: quantity
  //    }
  //    //        [Op.gte]: [{quantity}]
  //  }
  //});

  //if(hotel.length === 0){
  //  res.status(401).json({
  //    status: 'error',
  //    message: 'There is not posible to add this quantity, please verify the'
  //  });
  //  return
  //}

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    //first hotel add
    const newCart = await Cart.create({
      userId: currentUser.id
    });
    const newHotelInCart = await HotelInCart.create({
      cartId: newCart.id,
      hotelId: hotelId,
      quantity: quantity
    });
  } else {
    // Cart already exists
    // Check if hotel is already in the cart
    const existHotelInCart = await HotelInCart.findOne({
      where: { cartId: cart.id, hotelId: hotelId }
    });

    if (existHotelInCart && existHotelInCart.status === 'active') {
      return next(
        new AppError(
          400,
          'The selected hotel exist in the cart, please verify it '
        )
      );
    }

    if (existHotelInCart && existHotelInCart.status === 'removed') {
      await existHotelInCart.update({ status: 'active', quantity: quantity });
    }

    // Add new hotel to cart
    if (!existHotelInCart) {
      await HotelInCart.create({ cartId: cart.id, hotelId, quantity });
    }
  }


  // hotelExist -> existe el hotel/habitacion en el carrito

  res.status(201).json({
    status: 'success',
    message: 'The hotel was add to cart correcty'
  });

  if (!HotelInCart) {
    return next(new AppError(404, 'This hotel does not exist in this cart'));
  }

  await HotelInCart.update({ status: 'removed', quantity: 0 });

  res.status(204).json({ status: 'success' });
});

exports.update_cartProduct = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { hotelId, quantity } = req.body;

  // Check if quantity exceeds available amount
  const hotel = await Hotel.findOne({
    where: { status: 'active', id: hotelId }
  });

  if (quantity > hotel.quantity) {
    return next(
      new AppError(400, `This hotel only has ${hotel.quantity} items`)
    );
  }

  // Find user's cart
  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(400, 'This user does not have a cart yet'));
  }

  // Find the hotel in cart requested
  const hotelInCart = await HotelInCart.findOne({
    where: { status: 'active', cartId: cart.id, hotelId }
  });

  if (!hotelInCart) {
    return next(
      new AppError(404, `Can't update hotel, is not in the cart yet`)
    );
  }

  // If qty is 0, mark the hotels status as removed
  if (quantity === 0) {
    await hotelInCart.update({ quantity: 0, status: 'removed' });
  }

  // Update hotel to new qty
  if (quantity > 0) {
    await hotelInCart.update({ quantity });
  }

  res.status(204).json({ status: 'success' });
});

exports.purchase_Cart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;

  // Find user's cart
  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id },
    include: [
      {
        model: Hotel,
        through: { where: { status: 'active' } }
      }
    ]
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  let totalPrice = 0;

  // Update all hotels as purchased
  const cartPromises = cart.hotels.map(async (hotel) => {
    await hotel.hotelincart.update({ status: 'purchased' });

    // Get total price of the order
    const hotelPrice = hotel.price * hotel.hotelincart.quantity;

    totalPrice += hotelPrice;

    // Discount the quantity from the hotel
    const newQty = hotel.quantity - hotel.hotelincart.quantity;

    return await hotel.update({ quantity: newQty });
  });

  await Promise.all(cartPromises);

  // Mark cart as purchased
  await cart.update({ status: 'purchased' });

  const newOrder = await Order.create({
    userId: currentUser.id,
    cartId: cart.id,
    issuedAt: Date.now().toLocaleString(),
    totalPrice
  });

  res.status(201).json({
    status: 'success',
    data: { newOrder }
  });
});

exports.remove_ProductFromCart = catchAsync(async (req, res, next) => {
  const { currentUser } = req;
  const { hotelId } = req.params;

  const cart = await Cart.findOne({
    where: { status: 'active', userId: currentUser.id }
  });

  if (!cart) {
    return next(new AppError(404, 'This user does not have a cart yet'));
  }

  const hotelInCart = await HotelInCart.findOne({
    where: { status: 'active', cartId: cart.id, hotelId }
  });

  if (!hotelInCart) {
    return next(new AppError(404, 'This hotel does not exist in this cart'));
  }

  await hotelInCart.update({ status: 'removed', quantity: 0 });

  res.status(204).json({ status: 'success' });
});

