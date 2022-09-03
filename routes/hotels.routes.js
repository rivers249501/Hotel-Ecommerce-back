const express = require('express');

const {
  getAllHotel,
  createHotel,
  getHotelById,
  getHotelByUbication,
  updateHotelPatch,
  deleteHotel
} = require('../controllers/hotels.controller');

//middlewares
const { validateSession } = require('../middlewares/auth.middlewares');
const { hotelExists, 
  hotelOwner 
} = require('../middlewares/hotel.middleware');


const { createHotelValidators, 
  validateResult 
} = require('../middlewares/validators.middleware');

const { upload } = require('../util/multer')

const router = express.Router();

router.get('/search/:query', getHotelByUbication )

// router.use(validateSession)
router.get('/', getAllHotel);

// router.post('/', createHotelValidators, validateResult, createHotel);
router.post('/',upload.single('photo'), createHotel);


router.use('/:id', hotelExists)
      .route('/:id')
      // .get(hotelOwner, getHotelById)
      .get(getHotelById)
      .patch( hotelOwner, updateHotelPatch)
      // .delete( hotelOwner, deleteHotel)
      .delete(deleteHotel)


module.exports = { hotelRouter: router };