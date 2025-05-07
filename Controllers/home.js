angular.module('myApp').controller('homeController', function($scope, $http) {
    
    //load data
    $http.get('http://localhost:3000/product')
        .then(function(response) {
            $scope.products = response.data;
        }, function(error) {
            console.error('Error fetching posts:', error);
        });
});
