/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    fs = require('fs'),
    cloudinary = require('cloudinary'),
    Schema = mongoose.Schema;


/**
 * Image Schema
 */

var ImageSchema = new Schema({
    title: {type : String, default : '', trim : true},
    user: {type : Schema.ObjectId, ref : 'User'},
    contest: {type : Schema.ObjectId, ref : 'Contest'},
    evaluations: [{
        user: { type : Schema.ObjectId, ref : 'User' },
        isPositive: { type : Boolean, default: false },
        createdAt: { type : Date, default : Date.now }
    }],
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