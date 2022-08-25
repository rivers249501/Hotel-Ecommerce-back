//models

const { Cart } = require("../models/carts.model");
const { Order } = require("../models/orders.model");
const { Hotel } = require("../models/hotel.model");
const { HotelInCart } = require("../models/hotelInCart.model");
const { User } = require("../models/users.model");


const initModels = () => {
  // 1 User <----> M H
  User.hasMany(Hotel);
  Hotel.belongsTo(User);

  // 1 user <----> M Order
  User.hasMany(Order) //throughout cart;
  Order.belongsTo(User)  //throughout cart ;

   // 1 User <--> 1 Cart
   User.hasOne(Cart);
   Cart.belongsTo(User);
 
   // M Cart <--> M Hotel
   Cart.belongsToMany(Hotel, { through: HotelInCart });
   Hotel.belongsToMany(Cart, { through: HotelInCart });
 
   // 1 Order <--> 1 Cart
   Cart.hasOne(Order);
   Order.belongsTo(Cart);

};

module.exports = { initModels };