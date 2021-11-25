const { searchHelper, paginationHelper } = require('../../helpers/query/queryMiddlewareHelpers');
const asyncErrorWrapper = require('express-async-handler');

const userQueryMiddleware = function (model) {
    return asyncErrorWrapper(async function (req, res, next) {
        let query = model.find();
        query = searchHelper('name', query, req);
        const total = await model.countDocuments();
        const paginationResults = await paginationHelper(total, query, req);
        query = paginationResults.query;
        let pagination = paginationResults.pagination;
        const queryResults = await query;
        res.queryResults = {
            success: true,
            count: queryResults.length,
            pagination: pagination,
            data: queryResults
        }
        next();
    });
};
module.exports = { userQueryMiddleware };