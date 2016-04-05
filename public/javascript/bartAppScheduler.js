var app = angular.module("bartAppScheduler", ['ngRoute', 'ngResource'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainScreen'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

//---
// services
//---

app.factory('youAreHere', function($resource, $q, $rootScope) {
    //[TO DO] return the station that is closes to the user by getting their lat and longs
    return $resource('/yah/here', {});
});

//---
// controllers
//---
app.controller('mainScreen', function($scope) {
    $scope.message = "Main Screen controller";

    //$scope.valueYouAreHere = youAreHere.get();

    console.log('about to enter vGeolocation');

    $scope.vGeoLocation = function getLocation() {
        console.log('start vGeolocation');

        var showPosition;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);

            alert("Latitude: " + showPosition.coords.latitude +
                "<br>Longitude: " + showPosition.coords.longitude);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };
    console.log('after vGeolocation');

});