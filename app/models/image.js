/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    fs = require('fs'),
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
    image: {
        cdnUri: String,
        file: Object
    },
    createdAt  : {type : Date, default : Date.now}
});

/**
 * Pre-remove hook
 */

ImageSchema.pre('remove', function (next) {
//    var imager = new Imager(imagerConfig, 'S3')
//    var file = this.image.file
//
//    // if there are files associated with the item, remove from the cloud too
//    imager.remove(file, function (err) {
//        if (err) return next(err)
//    }, 'image')

    next()
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
        var self = this;
        if (!image.length) {
            self.save(cb);
        }
        var image = image[0];
        fs.readFile(image.path, function (err, data) {
            var newPath = '/img/users/' +
                    new Date().getTime() + '.' +
                    image.type.replace('image/', '');
            fs.writeFile(__dirname + '/../../public' + newPath, data, function (err) {
                if(!err) {
                    self.image = {cdnUri: newPath }
                    self.save(cb);
                }
            });
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
        var criteria = options.criteria || {}

        this.find(criteria)
            .populate('user', 'name')
            .sort({'createdAt': -1}) // sort by date
            .limit(options.perPage)
            .skip(options.perPage * options.page)
            .exec(cb)
    }

}

mongoose.model('Image', ImageSchema)