/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    async = require('async'),
    Schema = mongoose.Schema;


function nowPlusOneMonth() {
    var now = new Date();
    return now.setMonth(now.getMonth() + 1)
}

/**
 * Contest Schema
 */

var ContestSchema = new Schema({
    title : {type : String, default : '', trim : true},
    description : {type : String, default : '', trim : true},
    startDate : {type : Date, default : Date.now},
    dueDate : {type : Date, default : nowPlusOneMonth},
    showAuthor : {type : Boolean, default : false},
    showComments : {type : Boolean, default : false},
    private : {type : Boolean, default : false},
    maxPhotos : {type : Number, default : 3}
});


/**
 * Pre-remove hook
 */

ContestSchema.pre('remove', function (next) {
    var contest = this;
    mongoose.model('Image').find({'contest.contest': contest._id}, function(err, images) {
        async.map(images, function(image, cb) {
            image.remove(function() { cb(); });
        }, function(err, res){
            next();
        });
    })

})

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
            sort = options.sort || {'startDate': -1} // sort by start date

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
