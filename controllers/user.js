const User = require('../models/User');
const asyncErrorWrapper = require('express-async-handler');

const getSingleUser = asyncErrorWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    return res.status(200).json({
        success: true,
        data: user
    });
});

const getAllUsers = asyncErrorWrapper(async (req, res, next) => {
    return res.status(200).json(res.queryResults);
});

module.exports = {
    getSingleUser,
    getAllUsers
};