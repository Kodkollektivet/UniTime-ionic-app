
angular.module('myApp',
    [
        'myApp.controllers',
        'myApp.services',
        'ui.router',
        'ngResource'
    ]
)
    .config(function($interpolateProvider, $httpProvider, $resourceProvider, $stateProvider, $urlRouterProvider){

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
            controller: 'EventController'

        })
        .state('state2', {
            url: "/state2",
            templateUrl: "templates/state2.html"
        })
        .state('state2.list', {
            url: "/list",
            controller: 'CourseController',
            templateUrl: "templates/state2.list.html"
        })
        .state('state2.detail', {
            url: "/detail",
            controller: 'CourseController',
            templateUrl: "templates/state2.detail.html"
        });
    });