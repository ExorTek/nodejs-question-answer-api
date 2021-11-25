const asyncErrorWrapper = require('express-async-handler');
const { populateHelper, paginationHelper } = require('../../helpers/query/queryMiddlewareHelpers');

const answerQueryMiddleware = function (model, options) {
    return asyncErrorWrapper(async function (req, res, next) {
        const { questionId } = req.params;
        const total = (await model.findById(questionId))["answerCount"];
        const paginationResults = await paginationHelper(total, undefined, req);
        const startIndex = paginationResults.startIndex;
        const limit = paginationResults.limit;
        let queryObject = {};
        queryObject["answers"] = { $slice: [startIndex, limit] };
        let query = model.find({ _id: questionId }, queryObject);
        query = populateHelper(query, options.population)
        const queryResults = await query;
        res.queryResults = {
            success: true,
            pagination: paginationResults.pagination,
            data: queryResults
        };
        next();
    });
};
module.exports = { answerQueryMiddleware };