angular.module('unitime.controllers', [])

    .controller('CourseController', function($scope, $state, Course, RootData, item, $ionicFilterBar) {
        $scope.allCourses = item;  // All courses
        $scope.course;  // Specific course object
        var filterBarInstance;

        // Get a specific course
        $scope.getCourse = function(course_code) {
            Course.get({course:course_code},function(response){
                $scope.course = response[0];  // We are getting a list from tha API but only one abject in the list
                RootData.setCourse($scope.course);  // Add course to RootData
                $state.go('tab.course-detail');
            });
        };


        $scope.showFilterBar = function () {
            filterBarInstance = $ionicFilterBar.show({
                items: $scope.allCourses,
                update: function (filteredItems) {
                    $scope.allCourses = filteredItems;
                }
            });
        };

        $scope.refreshItems = function () {
            if (filterBarInstance) {
                filterBarInstance();
                filterBarInstance = null;
            }

            $timeout(function () {
                getItems();
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

        $scope.isThisCourseInMyCourses = function(courseIn){
            return RootData.courseInMyCourses(courseIn);
        };

    })

    // Detailed course view, and add course to my courses
    .controller('DetailCourseController', function($rootScope, $scope, $state, RootData) {
        // Course detailed object
        $scope.course = RootData.getCourse();
        $scope.myCourses = RootData.getMyCourses();
        $scope.alreadyAdded = RootData.courseInMyCourses($scope.course);


        // Function to add course to my list
        $scope.addCourseToSelectedCourses = function(){
            if(RootData.addToMyCourses($scope.course)){
                $rootScope.$broadcast('myCoursesUpdated');
                $scope.alreadyAdded = true;
            }
        }
    })

    .controller('MyCoursesController', function($scope, $rootScope, $state, RootData) {
        $scope.myCourses = RootData.getMyCourses();

        $scope.removeFromMyCourses = function(courseIn){
            if(RootData.removeFromMyCourses(courseIn)){
                $scope.myCourses = RootData.getMyCourses();
                $rootScope.$broadcast('myCoursesUpdated');
            }
        }
    })

    .controller('EventsController', function($scope, $state, RootData) {
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
            //getEventsFromAPI();
            $scope.events = RootData.getEvents();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply()
        };

        $scope.$on('myCoursesUpdated', function(event, args) {
            $scope.events = RootData.getEvents();
        });
    })
    .controller('CalendarCtrl', function($scope, $compile, $timeout) {

    });
