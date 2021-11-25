const express = require('express');
const { getSingleUser, getAllUsers } = require('../controllers/user');
const router = express.Router();
const User = require('../models/User');
const { userQueryMiddleware } = require('../middlewares/query/userQueryMiddleware');
const { checkUserExists } = require('../middlewares/database/databaseErrorHelper')

router.get('/:userId', checkUserExists, getSingleUser);
router.get('/', userQueryMiddleware(User), getAllUsers)

module.exports = router;