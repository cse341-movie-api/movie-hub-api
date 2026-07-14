const express = require('express');
const router = express.Router();
const controller = require('../controllers/usersController');
const { ensureAuthenticated } = require('../middleware/isAuthenticated');
const { validateUser, validateUserId } = require('../middleware/validate');

router.get('/email/:email', /* #swagger.tags = ['Users']*/ controller.getUserByEmail);
router.get('/', /* #swagger.tags = ['Users']*/ controller.getAllUsers);
router.get('/:id', /* #swagger.tags = ['Users']*/ validateUserId, controller.getOneUser);
router.post('/', /* #swagger.tags = ['Users'] #swagger.security = [{ "OAuth2HeaderKey": [] }]*/ ensureAuthenticated, validateUser, controller.createUser);
router.put('/:id', /* #swagger.tags = ['Users'] #swagger.security = [{ "OAuth2HeaderKey": [] }]*/ ensureAuthenticated, validateUserId, validateUser, controller.updateUser);
router.delete('/:id', /* #swagger.tags = ['Users'] #swagger.security = [{ "OAuth2HeaderKey": [] }]*/ ensureAuthenticated, validateUserId, controller.deleteUser);


module.exports = router;
