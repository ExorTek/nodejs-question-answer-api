const Question = require('../models/Question');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');

const askNewQuestion = asyncErrorWrapper(async (req, res, next) => {
    const information = req.body;
    const question = await Question.create({
        ...information,
        user: req.user.id
    });
    return res.status(200).json({
        success: true,
        data: question
    })
});

const getAllQuestions = asyncErrorWrapper(async (req, res) => {
    return res.status(200).json(res.queryResults);
});

const getSingleQuestion = asyncErrorWrapper(async (req, res) => {
    return res.status(200).json(res.queryResults);
});

const editQuestion = asyncErrorWrapper(async (req, res) => {
    const { questionId } = req.params;
    const { title, content } = req.body;
    let question = await Question.findById(questionId);
    question.title = title;
    question.content = content;
    question = await question.save();
    return res.status(200).json({
        success: true,
        data: question
    });
});

const deleteQuestion = asyncErrorWrapper(async (req, res) => {
    const { questionId } = req.params;
    await Question.findByIdAndDelete(questionId);
    return res.status(200).json({
        success: true,
        message: 'Question deleted successfully'
    });
});

const likeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);
    if (question.likes.includes(req.user.id)) {
        return next(new CustomError('You already like this question', 400));
    }
    question.likes.push(req.user.id);
    question.likeCount = question.likes.length;
    await question.save();
    return res.status(200).json({
        success: true,
        data: question
    });
});

const undoLikeQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);
    if (!question.likes.includes(req.user.id)) {
        return next(new CustomError('You don\'t like this question', 400));
    }
    const index = question.likes.indexOf(req.user.id);
    question.likes.splice(index, 1);
    question.likeCount = question.likes.length;
    await question.save();
    return res.status(200).json({
        success: true,
        data: question
    });
});

module.exports = {
    askNewQuestion,
    getAllQuestions,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
};