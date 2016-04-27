var app = angular.module("bartAppScheduler", ['ngRoute', 'ngResource'])
    .config(function ($routeProvider) {
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

app.factory('listStations', function ($resource, $q, $rootScope) {
    return $resource('/yah/listAllStations', {});
});

app.factory('departTime', function ($resource, $q, $rootScope) {
    return $resource('/yah/departTimeStation', {});
    // required parameter 'vOriginStation' as string
});

app.factory('stationSchedule', function ($resource, $q, $rootScope) {
    return $resource('/yah/stationSched', {});
    // required parameter 'vOriginStation' as string
});

app.factory('nearStation', function ($resource, $q, $rootScope) {
    return $resource('/yah/nearestStation', {});
    //required parameter {'latitude': vLat, 'longitude': vLong}
});

app.factory('detailsDepart', function($resource,$q, $rootScope){
    return $resource('/yah/tripDetailsDepart', {});
    // required parameter ??
});

//---
// controllers
//---
app.controller('mainScreen', function ($scope, listStations, departTime, stationSchedule, nearStation) {

    $scope.selectedStationYAH = "";
    $scope.vLatYAH = "0";
    $scope.vLongYAH = "0";
    $scope.vAccYAH = "0";

    $scope.selectedStationDS = "";
    $scope.vLatDS = "0";
    $scope.vLongDS = "0";
    //$scope.vAccDS = "0";

    $scope.error = "";

    var vDone = false;

    /*
        // [NOTE] 4/9/2016 - not using this at the moment
            $scope.aShowPosition = function (position) {
            $scope.vLatYAH = position.coords.latitude;
            $scope.vLongYAH = position.coords.longitude;
            //$scope.vAccYAH = position.coords.accuracy;
            $scope.$apply();
    
            console.log("aShowPosition, latitude = " + position.coords.latitude + ", longitude = " + position.coords.longitude); // [DEBUG]
        };
        
            // [NOTE] 4/9/2016 - not using this at the moment
        $scope.aLocation = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition($scope.aShowPosition)
            } else {
                $scope.error = "Angular Geolocation is not supported by this browser.";
            };
        };
        
        // [NOTE] 4/9/2016 - not using this at the moment
        //$scope.aLocation();
    */

    $scope.showResult = function () {
        return $scope.error == "";
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

    // list all stations as an array
    // key values are all arrays also
    // keys = [ name, abbr, gtfs_latitude, gtfs_longitude, address, city, county, state, zipcode ]
    $scope.stations = listStations.query(function () {
        $scope.NearestStation();

        //$scope.vStaDetailsYAH = $scope.nearSta;
        //$scope.vLatYAH = $scope.nearLat;
        //$scope.vLongYAH = $scope.nearLong;
        //$scope.selectedStationYAH = $scope.nearAbbr;

        //return $scope.vStaDetailsYAH;
    });

    $scope.hereMapYAH = function () {
        // current location abbreviation = $scope.selectedStationYAH
        var strSelectedStationYAH;

        for (var i = 0; i < $scope.stations.length; i++) {

            var vStaObj = JSON.parse(JSON.stringify($scope.stations[i]));

            var strStaObj = JSON.stringify(vStaObj.abbr);

            strSelectedStationYAH = JSON.stringify($scope.selectedStationYAH);

            if (strStaObj === strSelectedStationYAH) {

                $scope.vStaDetailsYAH = JSON.stringify($scope.stations[i]);
                $scope.vLatYAH = vStaObj.gtfs_latitude[0];
                $scope.vLongYAH = vStaObj.gtfs_longitude[0];

                //return $scope.stations[i];
                return $scope.vStaDetailsYAH;

            };
        };
    };

    $scope.hereMapDS = function () {
        // current location abbreviation = $scope.selectedStationDS
        for (var i = 0; i < $scope.stations.length; i++) {

            var vStaObj = JSON.parse(JSON.stringify($scope.stations[i]));

            var strStaObj = JSON.stringify(vStaObj.abbr);
            var strSelectedStationDS = JSON.stringify($scope.selectedStationDS);

            if (strStaObj === strSelectedStationDS) {

                $scope.vStaDetailsDS = JSON.stringify($scope.stations[i]);
                $scope.vLatDS = vStaObj.gtfs_latitude[0];
                $scope.vLongDS = vStaObj.gtfs_longitude[0];

                //return $scope.stations[i];
                return $scope.vStaDetailsDS;

            };
        };
    };

    $scope.nextTrain = function () {

        if ($scope.selectedStationYAH == '' || $scope.selectedStationYAH == null) {
            //$scope.showNextTrainTime = departTime.get({'vOriginStation':'19TH'});
            $scope.showNextTrainTime = departTime.query({ 'vOriginStation': '19TH' });
        } else {
            //$scope.showNextTrainTime = departTime.get({'vOriginStation': $scope.selectedStationYAH});
            $scope.showNextTrainTime = departTime.query({ 'vOriginStation': $scope.selectedStationYAH });
        };

        if ($scope.showNextTrainTime[0] == "no trains to display") {
            $scope.showNextTrainTime = 'Nothing to show now. Please try again later';

            return $scope.showNextTrainTime;
        };

        return $scope.showNextTrainTime;
    };

    $scope.getStationSchedule = function () {
        // show all trains that are travelling through selected station

        $scope.stationScheduleAll = stationSchedule.get({ 'vOriginStation': $scope.selectedStationYAH });

        return $scope.stationScheduleAll;
    };

    //$scope.mpValue="NextTrain";

    $scope.mpSubmit = function (value) {
        if (value == "NextTrain") {
            $scope.nextTrain();
        };

        if (value == "TripDetails") {
            //$scope.getStationSchedule();
            
            // get arrive
            
        };
    };

    //
    $scope.NearestStation = function () {
        var vCurPosition = '';
        var position;

        /*
                // [NOTE] - I feel like I need to do this on the server side.
                // if "$scope.stationScheduleAll" !null use for all stations and their details. The detail we care about is the lat and long.
                if ($scope.stationScheduleAll == null || $scope.stationScheduleAll == ''){
                    vStSchAll = $scope.getStationSchedule;
                };
        */

        $scope.aShowPosition = function (position) {
            $scope.nearLat = position.coords.latitude;
            $scope.nearLong = position.coords.longitude;
            $scope.nearAcc = position.coords.accuracy;

            vCurPosition = { 'latitude': $scope.nearLat, 'longitude': $scope.nearLong };

            nearStation.get(vCurPosition, function (value) {

                $scope.nearSta = value.nearSta;
                $scope.nearDist = value.nearDist;
                $scope.nearAbbr = value.nearAbbr;
                $scope.nearLat = value.nearLat;
                $scope.nearLong = value.nearLong;

            });

        };

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition($scope.aShowPosition);

        } else {
            $scope.error = "Angular Geolocation is not supported by this browser.";
        };
    };
});