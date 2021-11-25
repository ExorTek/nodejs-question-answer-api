const asyncErrorWrapper = require('express-async-handler');
const {
    searchHelper,
    populateHelper,
    questionSortHelper,
    paginationHelper
} = require('../../helpers/query/queryMiddlewareHelpers');

const questionQueryMiddleware = function (model, options) {
    return asyncErrorWrapper(async function (req, res, next) {
        let query = model.find();
        query = searchHelper("title", query, req);
        if (options && options.population) {
            query = populateHelper(query, options.population);
        }
        const total = await model.countDocuments();
        query = questionSortHelper(query, req);
        const paginationResults = await paginationHelper(total, query, req);
        query = paginationResults.query;
        const pagination = paginationResults.pagination;
        const queryResults = await query;
        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        }
        next();
    });
}
module.exports = { questionQueryMiddleware };