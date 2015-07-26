
angular.module('myApp', [
    'ui.router',
    'ngResource',

    'services',
    'factories',
    'controllers'

])
    .config(function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/state1");
        //
        // Now set up the states
        $stateProvider
            .state('state1', {
                url: "/state1",
                templateUrl: "templates/state1.html",
                resolve: {
                    item: function(Course) {
                        var courseData = Course.query();
                        return courseData.$promise;
                    }
                },
                controller: 'EventController'
            })
            .state('state2', {
                url: "/state2",
                templateUrl: "templates/state2.html"
            })
            .state('state2.list', {
                url: "/list",
                templateUrl: "templates/state2.list.html",
                controller: function ($scope) {
                    $scope.things = ["A", "Set", "Of", "Things"];
                }
            })
    });