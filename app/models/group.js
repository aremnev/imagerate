/**
 * Module dependencies
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
    title : {type: String, required: true, unique: true, trim: true},
    mailMasks: {type: [String]}
});

/**
 * Methods
 */

GroupSchema.methods = {
    /**
     * adds mask into group
     * @param mask
     * @param cb
     */
    addMask : function(mask, cb){
        this.mailMask.push(mask);
        this.save(cb);
    },
    /**
     * remove mask from group
     * @param mask
     * @param cb
     */
    removeMask : function(mask, cb){
        var index = this.mailMask.indexOf(mask);
        if(index > -1){
            this.mailMask.splice(index, 1);
            this.save(cb);
        }
    }
};


mongoose.model('Group', GroupSchema);