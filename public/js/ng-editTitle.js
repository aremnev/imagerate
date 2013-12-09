function EditTitle ($scope, $http) {
    $scope.edit = false;
    $scope.save = function (new_title) {
        if (new_title)
            $http.post($scope.url, {'edit-title':new_title}).success($scope.title = new_title); 
    };
    $scope.show = function() {
        if ($scope.editForm.$valid)
            $scope.edit = !$scope.edit;
    };
}