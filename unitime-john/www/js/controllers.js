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
        };

        $scope.openUrl = function(){
            window.open($scope.course['url'], '_system', 'location=yes');
        }

        $scope.openSyllabusEN = function(){
            window.open($scope.course['syllabus_en'], '_system', 'location=yes');
        }

        $scope.openSyllabusSV = function(){
            window.open($scope.course['syllabus_sv'], '_system', 'location=yes');
        }
    })

    .controller('MyCoursesController', function($scope, $rootScope, $state, RootData) {
        $scope.myCourses = RootData.getMyCourses();

        $scope.removeFromMyCourses = function(courseIn){
            if(RootData.removeFromMyCourses(courseIn)){
                $scope.myCourses = RootData.getMyCourses();
                $rootScope.$broadcast('myCoursesUpdated');
            }
        };

        $scope.openUrl = function(courseIn){
            window.open(courseIn.url, '_system', 'location=yes');
        };

        $scope.openSyllabusEN = function(courseIn){
            window.open(courseIn.syllabus_en, '_system', 'location=yes');
        };

        $scope.openSyllabusSV = function(courseIn){
            window.open(courseIn.syllabus_sv, '_system', 'location=yes');
        }

        $scope.$on('myCoursesUpdated', function(event, args) {
            $scope.myCourses = RootData.getMyCourses();
        });
    })

    .controller('EventsController', function($scope, $state, RootData, $ionicPopup) {
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

        // Show today alert popup
        $scope.showTodayPopup = function() {
            var alertPopup = $ionicPopup.alert({
                //title: 'Today!',
                template: '<div align="center"><h3>Today!</h3></div>',
                buttons: [
                    { text: 'Ok' }
                ]
            });

        };

        // Show today alert popup
        $scope.showTomorrowPopup = function() {
            var alertPopup = $ionicPopup.alert({
                //title: 'Today!',
                template: '<div align="center"><h2>Tomorrow!</h2></div>',
                buttons: [
                    { text: 'Ok' }
                ]
            });

        };
    })
    .controller('CalendarCtrl', function($scope, $compile, $timeout) {
        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 450,
                editable: true,
                header:{
                    left: 'month agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                dayClick: $scope.alertEventOnClick,
                eventResize: $scope.alertOnResize
            }
        };

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        $scope.eventSources = [
            [
                {
                    "title": 'All Day Event',
                    "start": new Date(y, m, d)
                },
                {
                    "title": 'Long Event',
                    "start": new Date(y, m, d - 5),
                    "end": new Date(y, m, d - 2)
                }
            ]
        ];

    })

.controller('PopupCtrl',function($scope, $ionicPopup, RootData, $rootScope, Rate) {

    // Triggered on a button click, or some other target
    $scope.showPopup = function(course) {
        $scope.rating = 4;
        $scope.data = {
            rating : 1,
            max: 5
        };
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<rating ng-model="data.rating" max="data.max"></rating>',
            title: 'Rating',
            subTitle: 'Please rate the course ' + course['name_en'],
            scope: $scope,
            buttons: [
                { text: 'Cancel' ,
                onTap: function (e) {
                    if(RootData.removeFromMyCourses(course)) {
                        $rootScope.$broadcast('myCoursesUpdated');
                    }
                }},
                {
                    text: '<b>Rate</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if(RootData.removeFromMyCourses(course)){
                            $rootScope.$broadcast('myCoursesUpdated');
                            value = $scope.data.rating;
                            var rate = {course_code: course['course_code'], course_rate: value.toString(), notes: "ionicClient"};
                            Rate.save(rate);
                            return value;
                        }
                    }
                }
            ]
        });
    };
    });
