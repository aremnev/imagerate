/**
 * Module dependencies
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
    title : {type: String, required: true, unique: true, trim: true},
    mailMasks: {type: [String]},
    isAdmins : {type: Boolean, default: false}
});

/**
 * Methods
 */

GroupSchema.methods = {
    /**
     * remove mask from group
     * @param mask
     * @param cb
     */
    removeMask : function(mask, cb){
        var index = this.mailMasks.indexOf(mask);
        if(index > -1){
            this.mailMasks.splice(index, 1);
            this.save(cb);
        }else{
            cb("mask not found");
        }
    },


    checkEmail : function(mail){
        if(mail){
            for(var i=0; i < this.mailMasks.length; i++){
                var mask = this.mailMasks[i];
                var regexp = new RegExp(mask.replace(/\*/g, '.*'), 'ig');
                if(regexp.test(mail)){
                    return true;
                }
            }
        }
        return false;
    }
};

/**
 * Statics
 */

GroupSchema.statics = {
    list : function(criteria, cd){
        criteria = criteria || {};
        this.find(criteria, null, {sort : { _id : 1}}, cd);
    },

    findInGroups : function(mail, criteria, cb){
        if(mail){
            criteria = criteria || {};
            this.find(criteria, function(err, groups){
                var result = false;
                for(var i in groups){
                    if(groups[i].checkEmail(mail)){
                        result = groups[i];
                    }
                }
                cb(result);
            });
        }else{
            cb();
        }

    },

    isAdmin : function(mail, cb){
        this.findInGroups(mail, {isAdmins:true}, cb);
    }
};


mongoose.model('Group', GroupSchema);