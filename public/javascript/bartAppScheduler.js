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
/*
app.factory('youAreHere', function($resource, $q, $rootScope) {
    //[TO DO] return the station that is closes to the user by getting their lat and longs
    return $resource('/yah/here', {});
});
*/

app.factory('listStations', function($resource, $q, $rootScope) {
    return $resource('/yah/listAllStations', {});
});

app.factory('departTime',function($resource,$q,$rootScope){
   return $resource('/yah/departTimeStation',{}); 
   
   // required parameter 'vOriginStation' as string
});

//---
// controllers
//---
app.controller('mainScreen', function($scope, listStations, departTime) {

    $scope.selectedStationYAH = "";
    $scope.vLatYAH = "0";
    $scope.vLongYAH = "0";
    //$scope.vAccYAH = "0";
        
    $scope.selectedStationDS = "";
    $scope.vLatDS = "0";
    $scope.vLongDS = "0";
    //$scope.vAccDS = "0";
    
    $scope.error = "";
    
/*
    // [NOTE] 4/9/2016 - not using this at the moment
    $scope.aShowPosition = function(position) {
        $scope.vLatYAH = position.coords.latitude;
        $scope.vLongYAH = position.coords.longitude;
        //$scope.vAccYAH = position.coords.accuracy;
        $scope.$apply();
    };

    // [NOTE] 4/9/2016 - not using this at the moment
    $scope.aLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.aShowPosition)
        } else {
            $scope.error = "Angular Geolocation is not supported by this browser.";
        };
    };
    
    // [NOTE] 4/9/2016 - not using this at the moment
    //$scope.aLocation();
*/

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
    
    // list all stations as an array
    // key values are all arrays also
    // keys = [ name, abbr, gtfs_latitude, gtfs_longitude, address, city, county, state, zipcode ]
    $scope.stations = listStations.query();

$scope.hereMapYAH = function(){
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
    
    $scope.hereMapDS = function(){
        // current location abbreviation = $scope.selectedStationDS
        for(var i=0; i < $scope.stations.length; i++ ){
            
            var vStaObj = JSON.parse(JSON.stringify($scope.stations[i]));
            
            var strStaObj = JSON.stringify(vStaObj.abbr);
            var strSelectedStationDS = JSON.stringify($scope.selectedStationDS);
            
            if (strStaObj === strSelectedStationDS){
                            
              $scope.vStaDetailsDS = JSON.stringify($scope.stations[i]);
              $scope.vLatDS = vStaObj.gtfs_latitude[0];
              $scope.vLongDS = vStaObj.gtfs_longitude[0];
              
              return $scope.stations[i];
                
            };
        };
    };

$scope.nextTrain = departTime.get({'vOriginStation':'19TH'});
//$scope.nextTrain = departTime.query({'vOriginStation':$scope.selectedStationYAH})

});