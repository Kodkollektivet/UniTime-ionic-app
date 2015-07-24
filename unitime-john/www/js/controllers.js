angular.module('unitime.controllers', [])

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

    // Detailed course view, and add course to my courses
    .controller('DetailCourseController', function($scope, $state, RootData) {
        // Course detailed object
        $scope.course = RootData.getCourse();
        $scope.myCourses = RootData.getMyCourses();

        $scope.thisCourseInMyCourses = function(){
            if(_.contains(_.map($scope.myCourses, function(course){
                    return course.course_code;
                }), $scope.course['course_code'])){
                return true;

            }
            else {
                return false;
            }
        };


        // Function to add course to my list
        $scope.addCourseToSelectedCourses = function(course){

            if(!_.contains(_.map($scope.myCourses, function(course){
                    return course.course_code;
                }), $scope.course['course_code'])){
                RootData.setMyCourses = RootData.getMyCourses().push(course);
            }
        }
    })

    .controller('MyCoursesController', function($scope, $state, RootData) {
        $scope.myCourses = RootData.getMyCourses();

        $scope.removeFromMyCourses = function(courseIn){
            $scope.myCourses.splice($scope.myCourses.indexOf(courseIn), 1);
            RootData.setMyCourses = $scope.myCourses;
        }

    })

    .controller('EventsController', function($scope, $state, Event, RootData) {
        $scope.events = [];
        $scope.event = RootData.getEvent();  // Single event object, used for event detail view
        $scope.myCourses = RootData.getMyCourses();
        $scope.dateToday = new Date().setHours(0,0,0,0);
        var date_today_1 = new Date();
        $scope.dateTomorrow = new Date(date_today_1.getFullYear(), date_today_1.getMonth(), date_today_1.getDate()+1).setHours(0,0,0,0);

        // Get events for a specific course
        var getEventsFromAPI = function() {
            $scope.events = [];  // Empty list

            // If there is any courses saved to myCourses in RootData
            if (RootData.getMyCourses().length > 0){

                // Iterate over my course list and get events from API
                angular.forEach(RootData.getMyCourses(), function(course){

                    // Send get request to API, reponse will be a list of event objects
                    Event.get({course:course['course_code']},function(response){

                        // Iterate over response and add events to events list
                        angular.forEach(response, function(event){
                            var date = event['startdate'].split('-');

                            var starttime = event['starttime'].split(':');
                            var endtime = event['endtime'].split(':');
                            var start_datetime = new Date(date[0], date[1]-1, date[2], starttime[0], starttime[1]);
                            var end_datetime = new Date(date[0], date[1]-1, date[2], endtime[0], endtime[1]);
                            var start_date = new Date(date[0], date[1]-1, date[2]).setHours(0,0,0,0);
                            event['date'] = start_date;
                            event['start_datetime'] = start_datetime;
                            event['end_datetime'] = end_datetime;

                            // Add event to list
                            $scope.events.push(event);
                        });
                    });
                });
            }
        };

        $scope.eventDetail = function(dataIn){
            RootData.setEvent(dataIn);
            $state.go('tab.event-detail');
        };

        $scope.doRefresh = function() {
            getEventsFromAPI();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply()
        };


    })
    .controller('CalendarCtrl', function($scope, $compile, $timeout, uiCalendarConfig) {

    });
