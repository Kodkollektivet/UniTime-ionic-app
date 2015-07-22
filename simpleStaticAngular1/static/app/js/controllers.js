
angular.module('myApp.controllers', [])

    .controller('CourseController', function($scope, Course){

        $scope.courses;  // All courses in a list
        $scope.course;  // One course object

        Course.query(function(response){
            $scope.courses = response;
        });

        Course.get({course:'1BD105'},function(response){
            $scope.course = response[0];  // We are getting a list from tha API but only one abject in the list
        });
    })

    .controller('EventController', function($scope, Event){

        $scope.events;

        Event.get({course:'1BD105'},function(response){
            $scope.events = response;
        });
    });