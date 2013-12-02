/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    fs = require('fs'),
    cloudinary = require('cloudinary'),
    _ = require('underscore'),
    knox = require('../config/knox'),
    Schema = mongoose.Schema;

var Image;


/**
 * Image Schema
 */

var ImageSchema = new Schema({
    title: {type : String, default : '', trim : true},
    user: {type : Schema.ObjectId, ref : 'User'},
    contest: {
        contest: {type : Schema.ObjectId, ref : 'Contest'},
        ratingSum: Number,
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
    views: [{
        user: { type : Schema.ObjectId, ref : 'User' },
        createdAt: { type : Date, default : Date.now }
    }],
    viewsCount: {type: Number, default: 0},
    image: {
        cdnUri: String,
        data: {}
    },
    private: {type: Boolean, default: false},
    createdAt  : {type : Date, default : Date.now}
});

/**
 * Pre-remove hook
 */

ImageSchema.pre('remove', function (next) {
    if(!this.image.data || !this.image.data.public_id) {
        return next();
    }
    var name = this.getCdnId();
    cloudinary.uploader.destroy(this.image.data.public_id, function(data){
        var client = knox.instance();
        if(client) {
            client.deleteFile(name, function (err, res) {
                if (err) console.error(err);
                next();
            });
        } else {
            next();
        }
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

                if (data.error) {
                    return cb({ image: 'Invalid file'});
                }
                self.image.data = data;
                var client = knox.instance();
                if(client) {
                    client.putFile(image.path, self.getCdnId(), { 'x-amz-acl': 'public-read' }, function (err, res) {
                        self.image.cdnUri = 'http://' + client.urlBase + '/' + self.getCdnId();
                        self.save(cb)
                    });
                }  else {
                    self.image.cdnUri = '';
                    self.save(cb)
                }
            }, {transformation: transformation,
                eager: [
                {width: 600, height: 360, crop: 'fill', gravity: 'faces'},
                {height: 800, width: 952, crop: 'limit'}
            ]});

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

        var evaluation = _.find(this.contest.evaluations, function(evaluation) {
            var user_id = evaluation.user;
            return user_id + '' === user._id + '';
        });

        if (evaluation) {
            var newRating = contest.ratingSum - evaluation.rating + rateValue;
            evaluation.rating = rateValue;
        } else {
            var newRating = (contest.ratingSum || 0) + rateValue;
            contest.evaluationsCount++;
            this.contest.evaluations.push({
                user: user._id,
                rating: rateValue
            });
        }
        contest.ratingSum = newRating;
        this.save(callback);
    },

    /**
     * Returns sum rating for image
     */
    getRating: function() {
        return this.contest.ratingSum || 0;
    },

    /**
     * Returns sum rating for image
     */
    getCdnId: function() {
        return  this.image.data.public_id + '.' + this.image.data.format;
    },

    getData: function() {
        return  this.image.data.public_id;
    },

    /**
     * Returns rate by concrete user if that user rated the image.
     * Else returns 0
     */
    getRatingByUser: function(user, callback) {
        var evaluation = _.find(this.contest.evaluations, function(evaluation) {
            var user_id = evaluation.user._id || evaluation.user;
            return user_id + '' === user._id + '';
        })
        callback(null, evaluation ? evaluation.rating : 0);
    },

    addViewedByUser: function(user, callback) {
        this.populate('views.user', '_id', function(err, image){
            var view = _.find(image.views, function(view) {
                return view.user._id + '' == user._id + '';
            });
            if (!view) {
                image.views.push({user: user._id});
                image.viewsCount++;
            } else {
                view.createdAt = Date.now();
            }
            image.save(callback);
        });
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
            .populate('user', 'name google')
            .populate('contest.contest')
            .populate('evaluations', '', null, { sort: [['createdAt', -1 ]] })
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
            .populate('user', 'name google')
            .populate('contest.contest', 'title dueDate')
            .populate('comments.user')
            .sort(sort)
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    },

    /**
     * returns next image for the same contest
     */
    next : function(image, cb){
        this.findOne()
            .where('contest.contest').equals(image.contest.contest)
            .where('createdAt').gt(image.createdAt)
            .sort({'createdAt':1})
            .exec(cb)
    },

    /**
     * returns prev image for the same contest
     */
    prev : function(image, cb){
        this.findOne()
            .where('contest.contest').equals(image.contest.contest)
            .where('createdAt').lt(image.createdAt)
            .sort({'createdAt': -1})
            .exec(cb)
    },

    getByContest : function(contest, callback) {
        this.find()
            .where('contest.contest').equals(contest)
            .limit(2)
            .exec(callback)
    }

}

Image = mongoose.model('Image', ImageSchema)
