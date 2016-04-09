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

app.factory('listStations', function($resource, $q, $rootScope) {
    return $resource('/yah/listAllStations', {});
});

//---
// controllers
//---
app.controller('mainScreen', function($scope, youAreHere, listStations) {

    $scope.message = "Main Screen controller";

    $scope.vLatYAH = "0";
    $scope.vLatYAH = "0";
    
    $scope.vLongDS = "0";
    $scope.vLongDS = "0";
    
    $scope.vAcc = "0";
    $scope.error = "";
    $scope.selectedStationYAH = "";
    $scope.selectedStationDS = "";

    $scope.aShowPosition = function(position) {
        $scope.vLatDS = position.coords.latitude;
        $scope.vLongDS = position.coords.longitude;
        $scope.vAcc = position.coords.accuracy;
        $scope.$apply();
    };

    $scope.aLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.aShowPosition)
        } else {
            $scope.error = "Angular Geolocation is not supported by this browser.";
        };
    };

    $scope.showResult = function() {
        return $scope.error == "";
    };
    
    $scope.showError = function(error) {
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

    // list all stations as an array
    // key values are all arrays also
    // keys = name, abbr, gtfs_latitude, gtfs_longitude, address, city, county, state, zipcode
    $scope.stations = listStations.query();

$scope.hereMap = function(){
        // current location abbreviation = $scope.selectedStationYAH
        for(var i=0; i < $scope.stations.length; i++ ){
            
            var vStaObj = JSON.parse(JSON.stringify($scope.stations[i]));
            
            var strStaObj = JSON.stringify(vStaObj.abbr);
            var strSelectedStationYAH = JSON.stringify($scope.selectedStationYAH);
            
            if (strStaObj === strSelectedStationYAH){
                            
              $scope.vStaDetailsYAH = JSON.stringify($scope.stations[i]);
              $scope.vLatYAH = vStaObj.gtfs_latitude[0];
              $scope.vLongYAH = vStaObj.gtfs_longitude[0];
              
              return $scope.stations[i];
                
            };
        };
    };
    
});