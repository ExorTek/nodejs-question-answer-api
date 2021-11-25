const express = require('express');
const {
    getAllQuestions,
    getSingleQuestion,
    askNewQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undoLikeQuestion
} = require('../controllers/question');
const answer = require('./answer');
const Question = require('../models/Question');
const { checkQuestionExist } = require('../middlewares/database/databaseErrorHelper');
const router = express.Router();
const { userPopulate, answerPopulate } = require('../helpers/lib/populateHelper');
const { questionQueryMiddleware } = require('../middlewares/query/questionQueryMiddleware');
const { answerQueryMiddleware } = require('../middlewares/query/answerQueryMiddleware');
const { getAccessToRoute, getQuestionOwnerAccess } = require('../middlewares/authorization/auth');

router.get('/', questionQueryMiddleware(Question, { population: [userPopulate(), answerPopulate()] }), getAllQuestions);
router.get('/:questionId/like', [getAccessToRoute, checkQuestionExist], likeQuestion);
router.get('/:questionId/undoLike', [getAccessToRoute, checkQuestionExist], undoLikeQuestion);
router.get('/:questionId', checkQuestionExist, answerQueryMiddleware(Question, { population: [userPopulate(), answerPopulate()] }), getSingleQuestion);
router.post('/ask', getAccessToRoute, askNewQuestion);
router.put('/:questionId/edit', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], editQuestion);
router.delete('/:questionId/delete', [getAccessToRoute, checkQuestionExist, getQuestionOwnerAccess], deleteQuestion);
router.use('/:questionId/answers', checkQuestionExist, answer);


module.exports = router;
