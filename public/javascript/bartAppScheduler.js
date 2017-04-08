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
    })
    .directive('myOnKeyDownCall', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {            
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
        });
    };
})
    ;

//---
// services
//---
/*
app.factory('listStations', function ($resource, $rootScope) {
    return $resource('/yah/listAllStations', {});
});
*/

//---
// controllers, 'mainScreen""
// Main splash screen that users hit
//---
app.controller('mainScreen', function ($scope, $http) {

    $scope.callRestService= function() {
        
  $http({method: 'GET', url: '/someUrl'}).
    success(function(data, status, headers, config) {
         $scope.results.push(data);  //retrieve results and add to existing results
    })
}

});

app.controller('ctlOwner', function ($scope, nearStation) {});

app.controller('ctlContact', function ($scope, nearStation) {});

app.controller('ctlAbout', function ($scope, nearStation) {});