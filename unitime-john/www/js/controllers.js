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
        };

        $scope.openSyllabusEN = function(){
            window.open($scope.course['syllabus_en'], '_system', 'location=yes');
        };

        $scope.openSyllabusSV = function(){
            window.open($scope.course['syllabus_sv'], '_system', 'location=yes');
        };
    })

    .controller('MyCoursesController', function($scope, $rootScope, $state, RootData, $http, PdfGetter) {
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

            var info = {'templatetype' : 'coursesyllabus', 'code' : courseIn.course_code, 'documenttype' : 'pdf', 'lang' : 'en'};

            PdfGetter.save(info)
            .$promise.then(function (response) {
                var file = new Blob([response.data], {type: 'application/pdf'});
                var fileUrl = URL.createObjectURL(file);
                RootData.setSyllabus(fileUrl);
                $rootScope.$broadcast('pdfUpdated');
            });
            $state.go('tab.course-pdf');
        };

        $scope.openSyllabusSV = function(courseIn){
            var info = {'templatetype' : 'coursesyllabus', 'code' : courseIn.course_code, 'documenttype' : 'pdf', 'lang' : 'sv'};

            PdfGetter.save(info)
                .$promise.then(function (response) {
                    var file = new Blob([response.data], {type: 'application/pdf'});
                    var fileUrl = URL.createObjectURL(file);
                    RootData.setSyllabus(fileUrl);
                    $rootScope.$broadcast('pdfUpdated');
                });
            $state.go('tab.course-pdf');
        };

        $scope.$on('myCoursesUpdated', function(event, args) {
            $scope.myCourses = RootData.getMyCourses();
        });


    })

    .controller('EventsController', function($scope, $state, RootData, $ionicPopup, ngDialog) {
        $scope.events = RootData.getEvents();
        $scope.event = RootData.getEvent();  // Single event object, used for event detail view
        $scope.myCourses = RootData.getMyCourses();
        var today = new Date().setHours(0,0,0,0);
        $scope.dateToday = moment(today).toDate();
        $scope.dateTomorrow = moment(today).add(1, 'days').toDate();
        //$scope.dateTomorrow = new Date(date_today_1.getFullYear(), date_today_1.getMonth(), date_today_1.getDate()+1).setHours(0,0,0,0);


        $scope.eventDetail = function(dataIn){
            RootData.setEvent(dataIn);
            $state.go('tab.event-detail');
        };

        $scope.formatHeader = function (date) {
            return moment(date).format("D[/]M[ - ]dddd");
        };

        $scope.formatHeaderWeek = function (date) {
            return moment(date).format("[Week ]w");
        };

        $scope.doRefresh = function() {
            $scope.events = RootData.getEventsRefresh();
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

        $scope.checkIfImportant = function (event) {
            return !!/redovisning|tentamen|tenta|examination/.test(event['info'].toLowerCase());
        };

        $scope.$on('myCoursesUpdated', function(event, args) {
            $scope.events = RootData.getEvents();
        });

        $scope.getEventHeight = function(event) {
            return event['newDate'] ? 188 : 140;
        };
        $scope.getEventWidth = function(event) {
            return '100%';
        };

        // Show today alert popup
        $scope.showTodayPopup = function() {
            ngDialog.open({
                template: '<div align="center"><h3>Today</h3>' +
                '<p align="center">This icon means the event is happening today.</p>' +
                '<button class="button button-block button-dark" ng-click="closeThisDialog()">Ok</button></div>',
                className: 'ngdialog-theme-default',
                plain: true
            });

        };

        // Show today alert popup
        $scope.showTomorrowPopup = function() {
            ngDialog.open({
                template: '<div align="center"><h3>Tomorrow</h3>' +
                '<p align="center">This icon means the event is happening tomorrow.</p>' +
                '<button class="button button-block button-dark" ng-click="closeThisDialog()">Ok</button></div>',
                className: 'ngdialog-theme-default',
                plain: true
            });

        };

        // Show important events alert popup
        $scope.showImportantPopup = function() {
            ngDialog.open({
                template: '<div align="center"><h3>Important</h3>' +
                '<p align="center">This icon means the event is important, for instance a presentation or an exam.</p>' +
                '<button class="button button-block button-dark" ng-click="closeThisDialog()">Ok</button></div>',
                className: 'ngdialog-theme-default',
                plain: true
            });

        };
    })
    .controller('CalendarCtrl', function($scope, $state, $compile, RootData, uiCalendarConfig, ngDialog) {
        $scope.events = [];

        var alertOnEventClick = function( event, jsEvent, view){
            showPopup(event);
        };
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
                timeFormat: 'H:mm',
                axisFormat: 'H:mm',
                eventClick: alertOnEventClick,
                displayEventEnd: {
                    month: true,
                    basicWeek: true,
                    "default": true
                }
            }
        };

        $scope.$on('$ionicView.enter', function() {
            $('#myCalendar').fullCalendar('rerenderEvents');
        });

        $scope.eventSources = [ $scope.events ];

        _.observe(RootData.getEvents(), function(new_array, old_array) {
            $scope.events.splice(0, $scope.events.length);
            angular.forEach(RootData.getEvents(), function (event) {
                var data = {
                    title: event['name_en'],
                    start: event['start_datetime'],
                    end: event['end_datetime'],
                    info: event,
                    stick: true
                };
                if (/redovisning|tentamen|tenta|examination/.test(event['info'].toLowerCase())) {
                    data['color'] = '#B80000';
                }
                $scope.events.push(data);
            });
            //$('#myCalendar').fullCalendar('rerenderEvents');
        });

        var showPopup = function (event) {
            $scope.event = event['info'];
            ngDialog.open({
                template: 'templates/event-info.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
    };
    })

.controller('PopupCtrl',function($scope, $ionicPopup, RootData, $rootScope, Rate, ngDialog) {

    // Triggered on a button click
    $scope.showPopup = function(course) {
        $scope.course = course;
        $scope.rating = 4;
        $scope.data = {
            rating : 1,
            max: 5
        };
        var showPopup = ngDialog.open({
            template: 'templates/course-rating.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });

        $scope.clickSkip = function () {
            if(RootData.removeFromMyCourses(course)) {
                $rootScope.$broadcast('myCoursesUpdated');
            }
        };

        $scope.clickRate = function () {
            if(RootData.removeFromMyCourses(course)){
                $rootScope.$broadcast('myCoursesUpdated');
                var value = $scope.data.rating;
                var rate = {course_code: course['course_code'], course_rate: value.toString(), notes: "ionicClient"};
                Rate.save(rate);
                return value;
                }
        };
    };
})
    
.controller('PDFController', [ '$scope', 'PDFViewerService', 'RootData', function($scope, pdf, RootData) {
        $scope.viewer = pdf.Instance("viewer");

        $scope.url = RootData.getSyllabus();

        $scope.nextPage = function() {
            $scope.viewer.nextPage();
        };

        $scope.prevPage = function() {
            $scope.viewer.prevPage();
        };

        $scope.pageLoaded = function(curPage, totalPages) {
            $scope.currentPage = curPage;
            $scope.totalPages = totalPages;
        };

        $scope.$on('pdfUpdated', function(event, args) {
            $scope.url = RootData.getSyllabus();
        });
    }]);
