const User = require('../models/User');
const asyncErrorWrapper = require('express-async-handler');

const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    user.blocked = !user.blocked;
    await user.save();
    return res.status(200).json({
        success: true,
        message: user.blocked === true ? 'User blocking successful' : 'User unblocking successful.'
    });
});

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    await user.remove();
    return res.status(200).json({
        success: true,
        message: 'User delete successful'
    });
});

module.exports = {
    blockUser,
    deleteUser
}