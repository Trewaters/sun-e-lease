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
    
     $scope.vLat = "0";
     $scope.vLong = "0";
     $scope.accuracy = "0";
     $scope.error = "";
     
     $scope.showResult = function(){
         return $scope.error == "";
     };
     
    $scope.aShowPosition = function(position){
        $scope.vLat = position.coords.latitude;
        $scope.vLong = position.coords.longitude;
        $scope.vAcc = position.coords.accuracy;
        $scope.$apply();
    };
    
    $scope.aLocation = function(){
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition($scope.aShowPosition)
        }else{
            $scope.error = "Angular Geolocation is not supported by this browser.";
        };
    };
     
     $scope.showError = function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    $scope.error = "User denied the request for Geolocation."
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.error = "Location information is unavailable."
                    break;
                case error.TIMEOUT:
                    $scope.error = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.error = "An unknown error occurred."
                    break;
            }
            $scope.$apply();
        }
     $scope.aLocation();
});