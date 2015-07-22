
angular.module('myApp.controllers', [])

    .controller('CourseController', function($scope, Course, Event){

        $scope.courses = [];

        Course.query(function(response){
            $scope.courses = response;
        });

        $scope.event;

        Event.get({course:'1BD105'},function(events){
            $scope.event = events;
            console.log($scope.event);
        });
    });