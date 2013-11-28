function RatingController($scope, $http) {
    $scope.rating = {
        value: 0,
        count: 0,
        state: 'not-rated',
        defaultState: 'not-rated'
    };
    $scope.starHover = 0;
    $scope.stars = {};
    $scope.likes = [];

    $scope.initRating = function(rating) {
        this.rating.id = rating.id;
        if (rating.value) {
            this.rating.value = rating.value;
            this.rating.count = rating.count;
        }
        this.rating.byUser = rating.byUser || 0;
        if (rating.byUser) {
            this.rating.stars = $scope.renderStars(rating.byUser);
            this.rating.state = this.rating.defaultState = 'rated';
        }
    };

    $scope.renderStars = function(i) {
        return '☆☆☆☆☆'.split('').map(function(char, index) {
            return index < i ? '★' : '☆';
        }).join('');
    };

    $scope.rateIt = function(rateValue) {
        var url = ['/images', this.rating.id, 'rate', rateValue].join('/');
        $http.post(url).success(function(data) {
            $scope.rating.value = data.rating; 
            $scope.rating.count = data.count;
            $scope.rating.byUser = rateValue;
            $scope.rating.stars = $scope.renderStars(rateValue);
            $scope.rating.state = 'thanks-for-vote';
            $scope.rating.defaultState = 'rated';

            if (data.newLike) {
                for (key in $scope.likes) {
                    $scope.likes[key]._id == data.newLike._id;
                    return;
                }
                $scope.likes.unshift(data.newLike);
            }
        });
    };

    $scope.reloadPage = function() {
        if($scope.rating.state == 'thanks-for-vote') {
            setTimeout(function(){
                location.reload();
            }, 500);
        }
    }
}