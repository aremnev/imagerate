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
    started : {type : Boolean, default : true},
    dueDate: {type : Date}
});

/**
 * Validations
 */

ContestSchema.path('title').validate(function (title) {
    return title.length > 0
}, 'Contest title cannot be blank')

/**
 * Statics
 */

//ContestSchema.statics = {
//
//    /**
//     * Find article by id
//     *
//     * @param {ObjectId} id
//     * @param {Function} cb
//     * @api public
//     */
//
//    load: function (id, cb) {
//        this.findOne({ _id : id })
//            .populate('user', 'name')
//            .populate('comments.user')
//            .exec(cb)
//    },
//
//    /**
//     * List articles
//     *
//     * @param {Object} options
//     * @param {Function} cb
//     * @api public
//     */
//
//    list: function (options, cb) {
//        var criteria = options.criteria || {}
//
//        this.find(criteria)
//            .populate('user', 'name')
//            .sort({'createdAt': -1}) // sort by date
//            .limit(options.perPage)
//            .skip(options.perPage * options.page)
//            .exec(cb)
//    }
//
//}

mongoose.model('Contest', ContestSchema);
