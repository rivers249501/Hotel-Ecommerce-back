const { ref, uploadBytes } =require('firebase/storage')
//Models
const { Hotel } = require('../models/hotel.model');
const { User } = require('../models/users.model');
const { Checkboxes } =require('../models/checkboxes.model')

// Utils
const { catchAsync } = require('../util/catchAsync');
const { filterObject } = require('../util/filterObject');
const { storage } =require('../util/firebase')


exports.getAllHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findAll({
    where: { status: 'active' },
    include: [{ model: Checkboxes, }]
    // include: [{ model: User, attributes: { exclude: ['password'] } }]
  });

  // if (hotel.length === 0) {
  //   res.status(404).json({
  //     status: 'error',
  //     message: 'there are not hotel created until.'
  //   });
  //   return;
  // }
  res.status(201).json({
    status: 'success',
    data: {
      hotel
    }
  });
});

exports.getHotelById = catchAsync(async (req, res, next) => {
  const { hotel } = req;

  res.status(200).json({
    status: 'success',
    data: { hotel }
  });
});

exports.getHotelByUbication = async (req, res, next) => {

  // const { country } = req.params;
  // const countrySelect = await Hotel.findOne({
  //   where: {country, status: 'active'},
  //   title: new RegExp('^'+country+'$', "i")

  // });
  // res.status(200).json({
  //   status: 'succes',
  //   data: {
  //     countrySelect
  //   }
  // })


  // const { country } =req.params;
  // const search =Hotel.find( user => {
  //   let isValid = true;
  //   for(key in country){
  //     console.log(key, user[key], filters[key]);
  //     isValid = isValid && user[key] == filters[key]
  //   }
  //   return isValid
  // })
  // res.send(search);
  try {

    const {country} = req.params
    let search = await Hotel.findOne({where:{status: 'active' },
    title: new RegExp('^'+country+'$', "i")
    });

    res.json(search)

  } catch (error) {
    res.status(400).json({
      message: 'Error in process'
    })
  }
};

exports.createHotel = catchAsync(async (req, res, next) => {
  const { title, description, price, country, city, adress, cp, state, photo, id } = req.body;

  // const { id } = req.params
  // const { id } = req.currentUser;

  //Upload img to Cloud storage(firebase)
  console.log(req.file.originalname);
  const imgRef = ref(storage, `imgs/${Date.now()}-${req.file.originalname}`);
  
  const result = await uploadBytes(imgRef, req.file.buffer);

  const newHotel = await Hotel.create({
    title,
    description,
    price,
    country,
    city,
    adress,
    cp, 
    state,
    photo: result.metadata.fullPath,
    userId: +id
  });

  res.status(201).json({
    status: 'success',
    data: { newHotel }
  });
});

exports.updateHotelPatch = catchAsync(async (req, res, next) => {
  const { hotel } = req;

  const data = filterObject(
    'req.body',
    'title',
    'description',
    'price',
    'country',
    'city',
    'adress',
    'cp', 
    'state',
    'photo'
    // id: product.userId
  );

  await hotel.update({ ...data });

  res.status(201).json({
    status: 'success',
    message: `The hotel id ${hotel.id} was update correctly`
  });
});

exports.deleteHotel = catchAsync(async (req, res, next) => {
  const { hotel } = req;

  await hotel.update({ status: 'deleted' });

  res
    .status(201)
    .json({
      status: 'success',
      message: `The product id ${hotel.id} was update correctly`
    });
});