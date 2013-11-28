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
        groups.push({title : 'Admins', mailMasks : ['*', '*@thumbtack.net']});
        groups.push({title : 'Thumbtack', mailMasks : ['*', '*@thumbtack.net']});
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
        var group = new Group();
        group.title = req.title;
        group.save(function(err){
            if (err) res.status(500).render('500.ect');
            res.json(200, group);
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
        Group.findAndRemove({_id : req.group.id}, function(err){
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