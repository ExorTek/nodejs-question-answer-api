const userPopulate = () => {
    return new Object({
        path: 'user',
        select: 'name role profile_image'
    });
};
const answerPopulate = () => {
    return new Object({
        path: 'answers',
        select: 'content user question'
    });
};
const questionPopulate = () => {
    return new Object({
        path: 'question',
        select: 'title content likeCount'
    });
};

module.exports = {
    userPopulate,
    answerPopulate,
    questionPopulate
};