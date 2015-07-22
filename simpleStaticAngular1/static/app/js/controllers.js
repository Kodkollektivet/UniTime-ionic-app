
angular.module('myApp.controllers', [])

    .controller('CourseController', function($scope, Course, Event){

        $scope.courses = [];

        Course.query(function(response){
            for (var i = 0 ; i < response.length ; i++){
                $scope.courses.push(response[i]);
            }
        });

        $scope.event;

        Event.get({course:'1BD105'},function(events){
            $scope.event = events;
            console.log($scope.event);
        });
    });