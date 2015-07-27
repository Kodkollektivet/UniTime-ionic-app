angular.module('unitime.controllers', [])

    .controller('CourseController', function($scope, $state, Course, RootData, item) {
        $scope.allCourses = item;  // All courses
        $scope.course;  // Specific course object


        $scope.isThisCourseInMyCourses = function(courseIn){
            if (RootData.courseInMyCourses(courseIn)){
                return true;
            }
            else{
                return false
            }
        };


        // Get a specific course
        $scope.getCourse = function(course_code) {
            Course.get({course:course_code},function(response){
                $scope.course = response[0];  // We are getting a list from tha API but only one abject in the list
                RootData.setCourse($scope.course);  // Add course to RootData
                $state.go('tab.course-detail');
            });
        }
    })

    // Detailed course view, and add course to my courses
    .controller('DetailCourseController', function($rootScope, $scope, $state, RootData) {
        // Course detailed object
        $scope.course = RootData.getCourse();
        $scope.myCourses = RootData.getMyCourses();
        $scope.thisCourseInMyCourses = RootData.courseInMyCourses(RootData.getCourse());


        // Function to add course to my list
        $scope.addCourseToSelectedCourses = function(course){

            if(RootData.addToMyCourses(course)){
                $scope.myCourses = RootData.getMyCourses();
                $scope.thisCourseInMyCourses = true;
                $rootScope.$broadcast('myCoursesUpdated');
            }
        }
    })

    .controller('MyCoursesController', function($rootScope, $scope, $state, RootData) {
        $scope.myCourses = RootData.getMyCourses();

        $scope.removeFromMyCourses = function(courseIn){
            if(RootData.removeFromMyCourses(courseIn)){
                $scope.myCourses = RootData.getMyCourses();
            }
        }
    })

    .controller('EventsController', function($rootScope, $scope, $state, Event, RootData) {
        $scope.events = RootData.getEvents();
        $scope.event = RootData.getEvent();  // Single event object, used for event detail view
        $scope.myCourses = RootData.getMyCourses();
        $scope.dateToday = new Date().setHours(0,0,0,0);
        var date_today_1 = new Date();
        $scope.dateTomorrow = new Date(date_today_1.getFullYear(), date_today_1.getMonth(), date_today_1.getDate()+1).setHours(0,0,0,0);


        $scope.eventDetail = function(dataIn){
            RootData.setEvent(dataIn);
            $state.go('tab.event-detail');
        };

        $scope.doRefresh = function() {
            $scope.events = RootData.getEvents();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply()
        };

        $rootScope.$on('myCoursesUpdated', function() {
            $scope.events = RootData.getEvents();
        });

    })
    .controller('CalendarCtrl', function($scope, $compile, $timeout) {

    });
