const mongoose = require('mongoose');
const Question = require('./Question');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    content: {
        type: String,
        required: [true, 'Please provide a content'],
        minlength: [10, 'Please provide a minimum length 10 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    question: {
        type: mongoose.Schema.ObjectId,
        ref: 'Question',
        required: true
    }
});

AnswerSchema.pre('save', async function (next) {
    if (!this.isModified('user')) return next();
    try {
        const question = await Question.findById(this.question);
        question.answers.push(this._id);
        question.answerCount = question.answers.length;
        question.likeCount = question.answers.likes.length;
        await question.save();
        next();
    } catch (err) {
        return next(err);
    }
});
AnswerSchema.post('remove', async function (next) {
    try {
        const question = await Question.findById(this.question);
        await Question.deleteMany({
            question: this._id
        });
        question.answerCount = question.answers.length;
        question.likeCount = question.answers.likes.length;
        await question.save();
        await question.save();
    } catch (e) {
        return next(err);
    }
})

module.exports = mongoose.model('Answer', AnswerSchema);