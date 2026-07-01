const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const {ensureAuthenticated} = require('../middleware/isAuthenticated');

router.get('/email/:email', /* #swagger.tags = ['Users']*/ controller.getUserByEmail);
router.get('/', /* #swagger.tags = ['Users']*/ controller.getAllUsers);
router.get('/:id', /* #swagger.tags = ['Users']*/ controller.getOneUser);
router.post('/', /* #swagger.tags = ['Users']*/ ensureAuthenticated, controller.createUser);
router.put('/:id', /* #swagger.tags = ['Users']*/ ensureAuthenticated, controller.updateUser);
router.delete('/:id', /* #swagger.tags = ['Users']*/ ensureAuthenticated, controller.deleteUser);


module.exports = router;
