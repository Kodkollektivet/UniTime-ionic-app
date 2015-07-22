angular.module('starter.controllers', [])

    .controller('CourseController', function($scope, $state, Course, RootData) {
        $scope.allCourses;  // All courses
        $scope.course;  // Specific course object

        // This gets all the courses
        var getAllCourses = function(){
            Course.query(function(response){
                $scope.allCourses = response;
                RootData.setAllCourses(response);
            });
        };

        getAllCourses();

        // Get a specific course
        $scope.getCourse = function(course_code) {
            Course.get({course:course_code},function(response){
                $scope.course = response[0];  // We are getting a list from tha API but only one abject in the list
                RootData.setCourse($scope.course);  // Add course to RootData
                $state.go('tab.course-detail');
            });
        }
    })

    .controller('DetailCourseController', function($scope, $state, RootData) {
            $scope.course = RootData.getCourse();

            $scope.addCourseToSelectedCourses = function(course){
                RootData.setMyCourses = RootData.getMyCourses().push(course);
            }
    })

    .controller('MyCoursesController', function($scope, $state, RootData) {
        $scope.myCourses = RootData.getMyCourses();

    })

    .controller('EventsController', function($scope, $state, Event, RootData) {
        $scope.events = false;  // false if there are no courses added to myCorses in RootData

        // Get a specific course
        $scope.getEvents = function(course_code) {
            Event.get({course:course_code},function(response){
                $scope.events = response;
            });
        };

        $scope.init = function(){
            console.log('i am in events now');
            console.log(RootData.getMyCourses().length);
            $scope.getEvents('1BD105');
            // If there is any courses saved to myCourses in RootData
            if (RootData.getMyCourses().length > 0 && $scope.events.length == 0){
                $scope.events = [];
                angular.forEach(RootData.getMyCourses(), function(course){
                    console.log(course['course_code']);
                    //$scope.getCourse(course['1BD105']);
                })
            }
        };
        $scope.init();
    });
