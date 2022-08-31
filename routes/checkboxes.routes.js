const express = require('express');

// Controller
const {
    getAllCheckboxes,
    getCheckboxesById,
    createCheckboxes, 
    updateCheckboxesPatch, 
    deleteCheckboxes, 

} = require('../controllers/checkboxes.controller');

//middlewares
const { validateSession } = require('../middlewares/auth.middlewares');
const { hotelExists, 
  hotelOwner 
} = require('../middlewares/hotel.middleware');

const { createHotelValidators, 
  validateResult 
} = require('../middlewares/validators.middleware');

const router = express.Router();

// router.use(validateSession)
router.get('/', getAllCheckboxes);

router.post('/', createHotelValidators, validateResult, createCheckboxes);

router.use('/:id', hotelExists)
      .route('/:id')
      .get(hotelOwner, getCheckboxesById)
      .patch( hotelOwner, updateCheckboxesPatch)
      .delete( hotelOwner, deleteCheckboxes)


module.exports = { checkboxesRouter: router };