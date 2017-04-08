var app = angular.module("bartAppScheduler", ['ngRoute', 'ngResource', 'ngSanitize'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainScreen'
            })
            .when('/owner', {
                templateUrl: 'owner.html',
                controller: 'ctlOwner'
            })
            .when('/contact', {
                templateUrl: 'contact.html',
                controller: 'ctlContact'
            })
            .when('/about', {
                templateUrl: 'about.html',
                controller: 'ctlAbout'
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
app.controller('mainScreen', function ($scope) {});

app.controller('ctlOwner', function ($scope, nearStation) {});

app.controller('ctlContact', function ($scope, nearStation) {});

app.controller('ctlAbout', function ($scope, nearStation) {});