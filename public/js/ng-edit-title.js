function EditController($scope, $http) {
    $scope.title = getImageTitle();
    
    $scope.edit function (newTitle) {
        this.title = newTitle;
    }
}