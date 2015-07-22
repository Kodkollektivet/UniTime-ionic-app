
angular.module('myApp',
    [
        'myApp.controllers',
        'myApp.services',
        'ui.router',
        'ngResource'
    ]
)
    .config(function($interpolateProvider, $httpProvider, $resourceProvider, $stateProvider, $urlRouterProvider){

    // CSRF Support
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    // This only works in angular 3!
    // It makes dealing with Django slashes at the end of everything easier.
    $resourceProvider.defaults.stripTrailingSlashes = false;

    // Django expects jQuery like headers
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/state1");
    //
    // Now set up the states
    $stateProvider
        .state('state1', {
            url: "/state1",
            templateUrl: "templates/state1.html"
        })
        .state('state1.list', {
            url: "/list",
            templateUrl: "templates/state1.list.html",
            controller: function($scope) {
                $scope.items = ["A", "List", "Of", "Items"];
            }
        })
        .state('state2', {
            url: "/state2",
            templateUrl: "templates/state2.html"
        })
        .state('state2.list', {
            url: "/list",
            controller: 'CourseController',
            templateUrl: "templates/state2.list.html",
        });
    });