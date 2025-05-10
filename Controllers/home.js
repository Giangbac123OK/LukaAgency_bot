angular.module('myApp').controller('homeController', function($scope, $http) {
    const fbId = '100026557990314';
    const fbImageUrl = `https://graph.facebook.com/${fbId}/picture?type=normal`;
    $http.get(fbImageUrl)
        .then(function(response) {
            $scope.status = response.data; // Live hoặc Die
        })
        .catch(function(error) {
            console.error('Error:', error);
        });
});
