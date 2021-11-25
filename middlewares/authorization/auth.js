const { isTokenIncluded, getAccessTokenFromHeaders } = require('../../helpers/authorization/tokenHelpers');
const User = require('../../models/User');
const Question = require('../../models/Question');
const Answer = require('../../models/Answer');
const asyncErrorWrapper = require('express-async-handler');
const jwt = require('jsonwebtoken');
const CustomError = require('../../helpers/error/CustomError');

const getAccessToRoute = asyncErrorWrapper(async (req, res, next) => {
    const { JWT_SECRET_KEY } = process.env;
    const accessToken = getAccessTokenFromHeaders(req);
    if (!isTokenIncluded(req)) {
        return next(
            new CustomError('You are mot authorized to access this route', 401)
        );
    }
    jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return next(new CustomError('You are mot authorized to access this route', 401));
        }
        req.user = {
            id: decoded.id,
            name: decoded.name
        };
        next();
    });
});

const getAdminAccessToken = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user.role !== 'admin') {
        return next(new CustomError('You are not authorized to access this route!'), 403);
    }
    next();
});

const getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const questionId = req.params.questionId;
    const question = await Question.findById(questionId);
    if (question.user != userId) {
        return next(new CustomError('Only owner can access this operation', 403));
    }
    next();
});

const getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
    const userId = req.user.id;
    const answerId = req.params.answer_id;
    const answer = await Answer.findById(answerId);
    if (answer.user != userId) {
        return next(new CustomError('Only owner can access this operation', 403));
    }
    next();
});

module.exports = {
    getAccessToRoute,
    getAdminAccessToken,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
};