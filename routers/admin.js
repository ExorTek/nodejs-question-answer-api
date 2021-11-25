const express = require('express');
const router = express.Router();
const { getAccessToRoute, getAdminAccessToken } = require('../middlewares/authorization/auth');
const { blockUser, deleteUser } = require('../controllers/admin');
const { checkUserExists } = require('../middlewares/database/databaseErrorHelper');

router.use([getAccessToRoute, getAdminAccessToken]);
router.get('/block/:userId', checkUserExists, blockUser);
router.get('/delete/:userId', checkUserExists, deleteUser);

module.exports = router;