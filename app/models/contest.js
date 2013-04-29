/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


function nowPlusOneMonth() {
    var now = new Date();
    return now.setMonth(now.getMonth() + 1)
}

/**
 * Contest Schema
 */

var ContestSchema = new Schema({
    title: {type : String, default : '', trim : true},
    description: {type : String, default : '', trim : true},
    startDate : {type : Date, default : Date.now},
    dueDate: {type : Date, default : nowPlusOneMonth}
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
        var criteria = options.criteria || {startDate: {$lt : Date.now()}},
            sort = options.sort || {'startDate': -1} // sort by due date

        this.find(criteria)
            .sort(sort)
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    },
    actualList: function (cb) {
        var options = {
            criteria: {
                dueDate: {$gt : Date.now()}
            }
        }

        this.list(options, cb);
    }

}

mongoose.model('Contest', ContestSchema);
