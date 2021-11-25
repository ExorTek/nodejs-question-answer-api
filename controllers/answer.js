const Question = require('../models/Question');
const Answer = require('../models/Answer');
const asyncErrorWrapper = require('express-async-handler');
const CustomError = require('../helpers/error/CustomError');
const { userPopulate, questionPopulate, answerPopulate } = require('../helpers/lib/populateHelper');

const addNewAnswerToQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { questionId } = req.params;
    const userId = req.user.id;
    const information = req.body;
    const answer = await Answer.create({
        ...information,
        question: questionId,
        user: userId
    });
    return res.status(200).json({
        success: true,
        data: answer
    })
});

const getAllAnswerByQuestion = asyncErrorWrapper(async (req, res, next) => {
    const { questionId } = req.params;
    if (!questionId) {
        next(new CustomError('There is no such question'), 400);
    }
    const question = await Question
        .findById(questionId)
        .populate(answerPopulate())
        .populate(userPopulate());
    const answers = question.answers;
    return res.status(200).json({
        success: true,
        count: answers.length,
        data: answers
    });
});

const getSingleAnswer = asyncErrorWrapper(async (req, res, next) => {
        const { answerId } = req.params;
        if (!answerId) {
            next(new CustomError('There is no such answer'), 400);
        }
        const answer = await Answer
            .findById(answerId)
            .populate(questionPopulate())
            .populate(userPopulate());
        return res.status(200).json({
            success: true,
            data: answer
        });
    })
;

const editAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answerId } = req.params;
    const { content } = req.body;
    if (!content || !answerId) {
        next(new CustomError('The content area is missing or there is no such answer'), 400);
    }
    let answer = await Answer
        .findById(answerId)
        .populate(questionPopulate())
        .populate(userPopulate());
    answer.content = content;
    await answer.save();
    return res.status(200).json({
        success: true,
        data: answer
    });
});
const deleteAnswer = asyncErrorWrapper(async (req, res, next) => {
    const answerId = req.params.answerId;
    const answer = await Answer.findById(answerId);
    await answer.remove();
    if (!answerId || !answer) {
        next(new CustomError('There is no such answer'), 400);
    }
    return res.status(200).json({
        success: true,
        message: 'Answer delete successful'
    });

    // const { answer_id } = req.params;
    // const { question_id } = req.params;
    // const question = Question.findById(question_id);
    // await Answer.findByIdAndRemove(answer_id);
    // question.answers.splice(question.answers.indexOf(answer_id),1);
    // await question.save();
    // return res.status(200).json({
    //     success: true,
    //     message: "Answer delete successful"
    // });
});

const likeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const answerId = req.params.answerId;
    const answer = await Answer.findById(answerId);
    if (answer.likes.includes(req.user.id)) {
        return next(new CustomError('You already like this question', 400));
    }
    answer.likes.push(req.user.id);
    await answer.save();
    return res.status(200).json({
        success: true,
        data: answer
    });
});

const undoLikeAnswer = asyncErrorWrapper(async (req, res, next) => {
    const { answerId } = req.params;
    const answer = await Answer.findById(answerId);
    if (!answer.likes.includes(req.user.id)) {
        return next(new CustomError('You don\'t like this question', 400));
    }
    const index = answer.likes.indexOf(req.user.id);
    answer.likes.splice(index, 1);
    await answer.save();
    return res.status(200).json({
        success: true,
        data: answer
    });
});

module.exports = {
    addNewAnswerToQuestion,
    getAllAnswerByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    undoLikeAnswer,
    likeAnswer
};