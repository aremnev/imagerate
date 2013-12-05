function GroupsCtrl($scope, $http, $timeout){
    $scope.groups = typeof getGroups == "function" ? getGroups() : [];

    var base_url = '/groups';

    $scope.addGroup = function(title){

        $http.post(base_url, {title : title})
            .success(function(data, status){
                $scope.groups.push(data);
                $scope.new_group_title = '';
                showAlert('success', 'New group was added');
            })
            .error(function(data, status){
                showAlert('error', 'Something wrong. Please try again');
            })
    };

    $scope.removeGroup = function(group, index){
        var url = [base_url, group._id].join('/');
        $http.delete(url)
            .success(function(){
                $scope.groups.splice(index, 1);
                showAlert('success', 'Group was deleted');
            })
            .error(function(){
                console.log('some error');
            })
    };

    $scope.addMask = function(group, mask){
        if(group && group._id && mask){
            var url = [base_url, group._id, 'masks'].join('/');
            $http.post(url, {mask: mask})
                .success(function(){
                    group.mailMasks.push(mask);
                })
                .error(function(){
                    showAlert('error', 'Something wrong. Please try again');
                })
        }else{
            showAlert('error', 'Email mask is incorrect');
        }
    };

    $scope.removeMask = function(group, mask){
        var url = [base_url, group._id, 'masks', mask].join('/');
        $http.delete(url)
            .success(function(data, status){
                group.mailMasks = data.group.mailMasks;
            })
            .error(function(){
                showAlert('error', 'Something wrong. Please try again');
            })
    };

    function showAlert(type, text, time){
        time = time || 5000;
        $scope.alert = {
            type: ['alert', type].join('-'),
            message: text
        };
        if(time > 0){
            $timeout(hideAlert, time);
        }
    }

    function hideAlert(){
        $scope.alert = undefined;
    }
}