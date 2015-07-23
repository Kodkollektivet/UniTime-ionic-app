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

        // Function to add course to my list
        $scope.addCourseToSelectedCourses = function(course){
            // If my list already contains the course object, dont add it.
            if (!_.contains(RootData.getMyCourses(), course)){

                // Add course to my course list in RootData
                RootData.setMyCourses = RootData.getMyCourses().push(course);

            }
            else {
                // Do something if course already added.
                console.log("Course already added to your list");
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
                            var start_datetime = new Date(date[0], date[1], date[2], starttime[0], starttime[1]);
                            var end_datetime = new Date(date[0], date[1], date[2], endtime[0], endtime[1]);
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
