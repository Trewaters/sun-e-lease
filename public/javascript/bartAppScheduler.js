var app = angular.module("bartAppScheduler",['ngRoute','ngResource'])
.config(function($routeProvider){
    $routeProvider
    .when('/',{
        templateUrl:'main.html',
        controller:'mainScreen'
    })
    .otherwise({
        redirectTo:'/'
    });
});

//---
// services
//---
/*
app.factory('youAreHere', function($resource,$q,$rootScope,$filter){
    //[TO DO] return the station that is closes to the user by getting their lat and longs
    return $resource('/yah/here',{});
});
*/
//---
// controllers
//---
app.controller("mainScreen",function($scope){
    $scope.message = "Main Screen controller";
});