/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Contest Schema
 */

var ContestSchema = new Schema({
    title: {type : String, default : '', trim : true},
    description: {type : String, default : '', trim : true},
    startDate : {type : Date, default : Date.now},
    dueDate: {type : Date, default : Date.now}
});

/**
 * Validations
 */

ContestSchema.path('title').validate(function (title) {
    return title.length > 0
}, 'Contest title cannot be blank');

/**
 * Statics
 */

ContestSchema.statics = {

    /**
     * List contests
     *
     * @param {Object} options
     * @param {Function} cb
     * @api public
     */

    list: function (options, cb) {
        var criteria = options.criteria || {},
            sort = options.sort || {'createdAt': -1} // sort by date

        this.find(criteria)
            .sort(sort)
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }

}

mongoose.model('Contest', ContestSchema);
