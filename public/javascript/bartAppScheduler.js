var app = angular.module("bartAppScheduler", ['ngRoute', 'ngResource', 'ngSanitize'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainScreen'
            })
            .when('/nearSta', {
                templateUrl: 'nearSta.html',
                controller: 'ctlNearStationScreen'
            })
            .when('/nextTrain', {
                templateUrl: 'nextTrain.html',
                controller: 'nextTrainScreen'
            })
            .when('/tripDetails', {
                templateUrl: 'tripDetails.html',
                controller: 'tripDetailsScreen'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

//---
// services
//---
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

app.factory('detailsDepart', function ($resource, $q, $rootScope) {
    return $resource('/yah/tripDetailsDepart', {});
    // required parameter {'vOriginStation': station abbreviation, 'vDestination': station abbreviation}
    // optional additional parameters { vTime, vDate, vB, vA, vLegend }
});

//---
// controllers, 'mainScreen""
// Main splash screen that users hit
//---
app.controller('mainScreen', function ($scope, $rootScope, listStations, departTime, stationSchedule, nearStation, detailsDepart) {

    $scope.selectedStationYAH = "";
    $scope.vLatYAH = "0";
    $scope.vLongYAH = "0";
    $scope.vAccYAH = "0";

    $rootScope.selectedStationDS = "";
    $scope.vLatDS = "0";
    $scope.vLongDS = "0";
    //$scope.vAccDS = "0";

    $scope.error = "";

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
    $scope.stations = listStations.query();

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
        // current location abbreviation = $rootScope.selectedStationDS
        for (var i = 0; i < $scope.stations.length; i++) {

            var vStaObj = JSON.parse(JSON.stringify($scope.stations[i]));

            var strStaObj = JSON.stringify(vStaObj.abbr);
            var strSelectedStationDS = JSON.stringify($rootScope.selectedStationDS);

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

        console.log("$scope.selectedStationYAH = " + $scope.selectedStationYAH); // [DEBUG]

        if ($scope.selectedStationYAH == '' || $scope.selectedStationYAH == null) {
            //$scope.showNextTrainTime = departTime.get({'vOriginStation':'19TH'});
            $scope.showNextTrainTime = departTime.query({ 'vOriginStation': 'NBRK' });
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

    $scope.mpSubmit = function (value) {
        if (value == "NextTrain") {
            $scope.nextTrain();
        };

        if (value == "TripDetails") {
            //$scope.getStationSchedule();

            var vOriginStation = $scope.selectedStationYAH; // $scope.selectedStationYAH
            var vDestStation = $rootScope.selectedStationDS; // $rootScope.selectedStationDS

            vTripDetails = { 'vOriginStation': vOriginStation, 'vDestStation': vDestStation };

            detailsDepart.get(vTripDetails, function (value) {
                $scope.tripDetails = JSON.stringify(value);

                $scope.tdDest = value.destination[0];
                $scope.tdOrig = value.origin[0];
                $scope.tdSchNum = value.sched_num[0]; // [NOTE] - schedule number

                $scope.tdDestArrive = value.schedule[0].request[0].trip[0].$.destTimeMin; // [NOTE] - time rider arrives at destination
                $scope.tdOrigDep = value.schedule[0].request[0].trip[0].$.origTimeMin; // [NOTE] - time rider departs original station 
                $scope.tdMessageCo = value.message[0].co2_emissions[0]; // [NOTE] - message for this trip 

                $scope.tdTransferNum = value.schedule[0].request[0].trip[0].leg.length;
                $scope.tdTransferSta = value.schedule[0].request[0].trip[0].leg[0].$.destination;

                // if ( value.schedule[0].request[0].trip[0].leg.length > 1 ) then the rider must transfer
            });
        };
    };

    // [NOTE] - still active but moving to own controller, 5/5/2016
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
                $scope.nearAddr = value.nearAddr;
                $scope.nearCity = value.nearCity;
                $scope.nearZip = value.nearZip;

            });

        };

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition($scope.aShowPosition);

        } else {
            $scope.error = "Angular Geolocation is not supported by this browser.";
        };
    };
});

//---
// controllers, 'ctlNearSta'
// near station controller
// [NOTE] - working on moving this from 'mainScreen' controller
//---

app.controller('ctlNearStationScreen', function ($scope, nearStation) {
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
                $scope.nearAddr = value.nearAddr;
                $scope.nearCity = value.nearCity;
                $scope.nearZip = value.nearZip;

            });

        };

        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition($scope.aShowPosition);

        } else {
            $scope.error = "Angular Geolocation is not supported by this browser.";
        };
    };
});