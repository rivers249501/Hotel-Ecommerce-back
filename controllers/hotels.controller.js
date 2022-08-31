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
  
  try {

    const {ubication} = req.params
    let search = await Hotel.findAll({where:{status: 'active' },
    title: new RegExp('^'+ubication+'$', "i")
    });

    res.json(search)

  } catch (error) {
    res.status(400).json({
      message: 'Error in process'
    })
  }
};

exports.createHotel = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price, ubication, imgUrl, id } = req.body;
  // const { id } = req.params
  // const { id } = req.currentUser;

  //Upload img to Cloud storage(firebase)
  const imgRef = ref(storage, `imgs/${Date.now()}-${req.file.originalname}`);
  const result = await uploadBytes(imgRef, req.file.buffer);

  const newHotel = await Hotel.create({
    title,
    description,
    quantity,
    price,
    ubication,
    imgUrl: result.metadata.fullPath,
    userId: id
  });

  res.status(201).json({
    status: 'success',
    data: { newHotel }
  });
});

exports.updateHotelPatch = catchAsync(async (req, res, next) => {
  const { hotel } = req;

  const data = filterObject(
    req.body,
    'title',
    'description',
    'quantity',
    'price',
    'ubication',
    'images'
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