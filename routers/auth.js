const express = require('express');
const router = express.Router();
const {
    register,
    getUser,
    login,
    logout,
    profilePhotoUpload,
    forgotPassword,
    resetPassword,
    editDetails
} = require('../controllers/auth');
const { getAccessToRoute } = require('../middlewares/authorization/auth');
const profileImageUpload = require('../middlewares/lib/profileImageUpload');

router.post('/register', register);
router.get('/profile', getAccessToRoute, getUser);
router.post('/login', login);
router.get('/logout', getAccessToRoute, logout);
router.post('/profileImageUpload', [getAccessToRoute, profileImageUpload.single("profile_image")], profilePhotoUpload);
router.post('/forgotPassword', forgotPassword);
router.put('/edit', getAccessToRoute, editDetails);
router.put('/resetPassword', resetPassword);


module.exports = router;
