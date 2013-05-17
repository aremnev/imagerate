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
    req.assert('contest.contest', 'Contest is invalid').len(24, 24).isAlphanumeric();
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
