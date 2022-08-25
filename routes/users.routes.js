const express = require('express')

const {
    getAllUsers,
    createUser,
    loginUser,
    getAllUsersHotel,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsersOrder,
    getAllUsersOrderbyId
  } = require('../controllers/users.controller');
  
  const { validateSession, protectAccountOwner } = require('../middlewares/auth.middlewares');
  
  const { userExists } = require('../middlewares/user.middlewares');
  
  const { createUserValidators, validateResult } = require('../middlewares/validators.middleware');
  
  const router = express.Router();
  
  router.post('/', createUserValidators, validateResult, createUser);

  router.post('/login', loginUser);
  
  router.use('/all', validateSession).get('/all', getAllUsers);
  
  router.use(validateSession)
  
  router.get('/me', getAllUsersHotel); //Por validar luego de agregar productos
  
  router.get('/orders', getAllUsersOrder)
  
  router.get('/orders/:id', protectAccountOwner, getAllUsersOrderbyId)
  
  router.use('/:id', userExists)
  
  router.route('/:id').get(getUserById)
    .patch(protectAccountOwner, updateUser)
    .delete(protectAccountOwner, deleteUser);
  
  module.exports = { usersRouter: router };