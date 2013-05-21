/*
 * This middleware provides validators for further resource creation or updating
 */

exports.createImage = createImage;
exports.createContest = createContest;
exports.createComment = createComment;

/**
 * Validates parameters for image creation
 *
 * @param req
 * @param res
 * @param next
 */
function createImage(req, res, next) {
    req.assert('title', 'Enter image title').notEmpty();
    var errors = req.validationErrors(true);

    if (!req.files.image) {
        errors = errors || {};
        errors.image = 'Attach file';
    }

    if (errors) {
        return res.send(400, { error: errors });
    }
    next();
}

/**
 * Validates parameters for contest creation
 *
 * @param req
 * @param res
 * @param next
 */
function createContest(req, res, next) {
    if('dueDate' in req.body) {
        req.assert('dueDate', 'Enter due date').notEmpty();
    }
    if('startDate' in req.body) {
        req.assert('startDate', 'Enter start date').notEmpty();
    }
    req.assert('title', 'Enter contest title').notEmpty();
    var errors = req.validationErrors(true);
    if (errors) {
        return res.send(400, { error: errors });
    }
    next();
}

/**
 * Validates parameters for comment posting
 *
 * @param req
 * @param res
 * @param next
 */
function createComment(req, res, next) {
    next();
}
