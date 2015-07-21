
angular.module('myApp.controllers', [])

    .controller('CourseController', function($scope, Course){

        $scope.courses = [];

        Course.query(function(response){
            for (var i = 0 ; i < response.length ; i++){
                $scope.courses.push(response[i]);
            }
        });

    });