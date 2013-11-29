/**
 * Modules dependencies
 */
var mongoose = require('mongoose'),
    Group = mongoose.model('Group')

/**
 * Return list of all groups
 * @param req
 * @param res
 */
exports.list = function(req, res){
    Group.find({}, function(err, groups){
        var locals = {
            title: 'User groups',
            groups: JSON.stringify(groups)
        };
        res.render('groups/list.ect', locals);
    });
};

/**
 * Add new group
 * req.group.title is required
 * @param req
 * @param res
 */
exports.addGroup = function(req, res){
    if(req.xhr){
        var group = new Group({title: req.body.title});
        group.save(function(err, group){
            if (err) {
                res.status(500).end({error: err.code});
                console.log(err);
            }
            res.json(group);
        });
    }else{
        res.status(404).render('404.ect');
    }
};

/**
 * remove group by _id
 * @param req
 * @param res
 */
exports.removeGroup = function(req, res){
    if(req.xhr){
        var id = req.param('groupId');
        Group.findByIdAndRemove(id, function(err){
            if(err) res.status(500).render('500.ect');
            res.status(200).json({'removed': true});
        });
    }else{
        res.status(404).render('404.ect');
    }
};


/**
 * Add mask to group
 * req.mask is required
 * @param req
 * @param res
 */
exports.addMask = function(req, res){

};

/**
 * Remove mask from group
 * req.mask id required
 * @param req
 * @param res
 */
exports.removeMask = function(req, res){

};