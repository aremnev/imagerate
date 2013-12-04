/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
    Group = mongoose.model('Group');

exports.settings = function(req, res){
    res.render('install/run.ect');
};

exports.run = function(req, res){
    if(req.body.mail){
        var group = new Group({
            title: 'Admins',
            isAdmins: true,
            mailMasks: [req.body.mail]
        });
        group.save(function(err){
            if(err) res.status(500).render('500.ect');
            res.render('install/result.ect');
        });
    }
};

exports.validate = function(req, res, next){
    Group.list({isAdmins:true}, function(err, groups){
        if(err) res.status(500).render('500.ect');
        if(groups.length > 0){
            var locals = {'err': "Application already installed"}
            res.status(500).render('500.ect', locals);
        }else{
            next();
        }
    });
};