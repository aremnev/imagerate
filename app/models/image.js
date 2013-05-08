/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    fs = require('fs'),
    cloudinary = require('cloudinary'),
    _ = require('underscore'),
    Schema = mongoose.Schema;


/**
 * Image Schema
 */

var ImageSchema = new Schema({
    title: {type : String, default : '', trim : true},
    user: {type : Schema.ObjectId, ref : 'User'},
    contest: {
        contest: {type : Schema.ObjectId, ref : 'Contest'},
        rating: Number,
        evaluationsCount: { type: Number, default: 0 },
        evaluations: [{
            user: { type : Schema.ObjectId, ref : 'User' },
            rating: Number,
            createdAt: { type : Date, default : Date.now }
        }]
    },
    comments: [{
        body: { type : String, default : '' },
        user: { type : Schema.ObjectId, ref : 'User' },
        createdAt: { type : Date, default : Date.now }
    }],
    commentsCount: {type: Number, default: 0},
    image: {
        cdnUri: String,
        data: {}
    },
    createdAt  : {type : Date, default : Date.now}
});

/**
 * Pre-remove hook
 */

ImageSchema.pre('remove', function (next) {
    if(!this.image.data || !this.image.data.public_id) {
        return next();
    }
    cloudinary.uploader.destroy(this.image.data.public_id, function(data){
        next();
    });

})

/**
 * Pre-save hook
 */

ImageSchema.pre('save', function (next) {
    var comments = [];
    _.each(this.comments, function(c){
        if(c.body && c.body.trim()) comments.push(c);
    });
    this.comments = comments;
    this.commentsCount = comments.length;
    next();
})


ImageSchema.methods = {

    /**
     * Save object and upload image
     *
     * @param {Object} image
     * @param {Function} cb
     * @api public
     */

    uploadAndSave: function (image, cb) {
        var self = this,
            transformation = {format: 'png', width: 1024, height: 1024, crop: 'limit'};

        var imageStream = fs.createReadStream(image.path, { encoding: 'binary' }),
            cloudStream = cloudinary.uploader.upload_stream(function(data) {
                if(data) {
                    self.image.cdnUri = data.secure_url;
                    self.image.data = data;
                    self.save(cb);
                }

            }, {transformation: transformation});

        imageStream.on('data', cloudStream.write).on('end', cloudStream.end);
    },

    /**
     * Updates average rating
     *
     * @param {Number} rateValue
     * @param {Object} user
     * @param {Function} callback
     */
    saveNewRateValue: function(rateValue, user, callback) {
        var contest = this.contest;
        var count = contest.evaluationsCount;

        var newRating = contest.rating
            ? (contest.rating * count + rateValue) / (count + 1)
            : rateValue;

        contest.rating = newRating;
        contest.evaluationsCount = count + 1;

        this.contest.evaluations.push({
            user: user._id,
            rating: rateValue
        });

        this.save(callback);
    },

    /**
     * Returns average rating for image
     */
    getRating: function() {
        return Math.round(this.contest.rating || 0);
    },

    /**
     * Returns rate by concrete user if that user rated the image.
     * Else returns null
     */
    getRatingByUser: function(user, callback) {
        this.model('Image')
            .findOne({_id: this._id,
                      'contest.evaluations.user': user._id},
                     {'contest.evaluations.$': 1},
                     onRatingByUserReceived);

        function onRatingByUserReceived(err, image) {
            if (err) {
                return callback(err);
            }

            var value = image ? image.contest.evaluations[0].rating : 0;
            callback(err, value);
        }
    }
}

/**
 * Statics
 */

ImageSchema.statics = {

    /**
     * Find image by id
     *
     * @param {ObjectId} id
     * @param {Function} cb
     * @api public
     */

    load: function (id, cb) {
        this.findOne({ _id : id })
            .populate('user', 'name')
            .populate('comments.user')
            .exec(cb)
    },

    /**
     * List images
     *
     * @param {Object} options
     * @param {Function} cb
     * @api public
     */

    list: function (options, cb) {
        var criteria = options.criteria || {},
            sort = options.sort || {'createdAt': -1}  // sort by date

        this.find(criteria)
            .populate('user', 'name')
            .sort(sort)
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }

}

mongoose.model('Image', ImageSchema)