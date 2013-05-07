function RatingController($scope, $http) {
    $scope.rating = {
        value: 0,
        count: 0,
        state: 'not-rated',
        defaultState: 'not-rated'
    };
    $scope.starHover = 0;
    $scope.stars = {};

    $scope.initRating = function(count, rating) {
        if (rating) {
            this.rating.value = rating;
            this.rating.count = count;

            // TODO: Render here only user stars
            this.rating.stars = $scope.renderStars(rating);
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
            console.log(data);
            $scope.rating.value = data.rating;
            $scope.rating.count = data.count;
            $scope.rating.stars = $scope.renderStars(rateValue);
            $scope.rating.state = 'thanks-for-vote';
            $scope.rating.defaultState = 'rated';
        });
    };
}