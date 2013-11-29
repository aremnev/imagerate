function GroupsCtrl($scope, $http, $timeout){
    $scope.groups = typeof getGroups ? getGroups() : [];

    var base_url = '/groups';

    $scope.addGroup = function(title){

        $http.post(base_url, {title : title})
            .success(function(data, status){
                $scope.groups.push(data);
                $scope.new_group_title = '';
                showAlert('success', 'New group was added');
            })
            .error(function(data, status){
                console.log(data);
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

    $scope.addMask = function(group, maks){

    };

    $scope.removeMask = function(group, mask){

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