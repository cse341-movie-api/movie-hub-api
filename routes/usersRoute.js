const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');


router.get('/', /* #swagger.tags = ['Users']*/ controller.getAllUsers);
router.get('/:id', /* #swagger.tags = ['Users']*/ controller.getOneUser);
router.post('/', /* #swagger.tags = ['Users']*/ controller.createUser);
router.put('/:id', /* #swagger.tags = ['Users']*/ controller.updateUser);
router.delete('/:id', /* #swagger.tags = ['Users']*/ controller.deleteUser);


module.exports = router;