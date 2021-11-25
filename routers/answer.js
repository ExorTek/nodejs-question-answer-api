const express = require('express');
const router = express.Router({ mergeParams: true });
const { getAccessToRoute, getQuestionOwnerAccess } = require('../middlewares/authorization/auth');
const { checkQuestionAndAnswerExist } = require('../middlewares/database/databaseErrorHelper');
const {
    addNewAnswerToQuestion,
    getAllAnswerByQuestion,
    getSingleAnswer,
    editAnswer, deleteAnswer, likeAnswer, undoLikeAnswer
} = require('../controllers/answer');

router.get('/', getAllAnswerByQuestion);
router.get('/:answerId', checkQuestionAndAnswerExist, getSingleAnswer);
router.get('/:answerId/like', [getAccessToRoute, checkQuestionAndAnswerExist], likeAnswer);
router.get('/:answerId/undoLike', [getAccessToRoute, checkQuestionAndAnswerExist], undoLikeAnswer);
router.put('/:answerId/edit', [checkQuestionAndAnswerExist, getAccessToRoute, getQuestionOwnerAccess], editAnswer);
router.post('/', getAccessToRoute, addNewAnswerToQuestion);
router.delete('/:answerId/delete', [checkQuestionAndAnswerExist, getAccessToRoute, getQuestionOwnerAccess], deleteAnswer);


module.exports = router;