angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope, $interval, $ionicSlideBoxDelegate, RootData, Course, SingleCourse, $state) {

        $scope.selected_courses = RootData.getCourses();
        $scope.all_courses = [];
        var course;

        /*$scope.data = {};
        $scope.data.selected = [{courses: selected_courses}];
        $scope.data.all = [{courses: all_courses}];*/

        Course.query(function (response) {
            $scope.all_courses = response;
            //$scope.courses = response.data;
        });

        $scope.getCourseInfo = function (course_code) {
            SingleCourse.get({course: course_code},function(response){
                RootData.setSelectedCourse(response[0]);  // We are getting a list from tha API but only one abject in the list
                console.log(RootData.getSelectedCourse());
                $state.go('tab.dash-detail');
            });


        }

    })

    .controller('ChatsCtrl', function ($scope, $http, Chats, $state, Course, RootData) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        var selected_courses = [];
        $scope.all_courses = [];

        /*$scope.data = {}
        $scope.data.selected = [{courses: selected_courses}];
        $scope.data.all = [{courses: all_courses}];*/

        Course.query(function (response) {
            for (var i = 0; i < response.length; i++) {
                $scope.all_courses.push(response[i]);
            }
            //$scope.courses = response.data;
        });

        $scope.getCourse = function (course_code) {
            $http({
                url: 'http://unitime.se/api/course/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: "POST",
                dataType: 'json',
                async: false,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {course: course_code}
            })
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {

                        // If course is already added to selected_courses list
                        if (_.contains(_.map(selected_courses, function (course) {
                                return course.course_code;
                            }), response.data[i]['course_code'])) {
                        }
                        else {
                            selected_courses.push(response.data[i]); // Push course obj to selected list
                            RootData.setSelectedCourse(selected_courses);
                            console.log(response.data[i]);
                            $state.go('tab.chat-detail');
                        }
                    }


                },
                function (response) { // optional
                    console.log(response);
                });
        };



            $scope.printDashScope = function () {
                console.log('i am in printDashScope');
                for (var i = 0; i < RootData.getCourses().length; i++) {
                    console.log(RootData.getCourses()[i]['name_en']);
                }
            };
        })


            .controller('ChatDetailCtrl', function ($scope, $http, $stateParams, RootData) {
                $scope.course_info = RootData.getSelectedCourse();

                $scope.courses = [];
                $scope.selected_courses = [];


                $scope.getCourse = function (course_code) {
                    $http({
                        url: 'http://unitime.se/api/course/',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        method: "POST",
                        dataType: 'json',
                        async: false,
                        transformRequest: function (obj) {
                            var str = [];
                            for (var p in obj)
                                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                            return str.join("&");
                        },
                        data: {course: course_code}
                    })
                        .then(function (response) {
                            for (var i = 0; i < response.data.length; i++) {

                                // If course is already added to selected_courses list
                                if (_.contains(_.map($scope.selected_courses, function (course) {
                                        return course.course_code;
                                    }), response.data[i]['course_code'])) {
                                }
                                else {
                                    $scope.selected_courses.push(response.data[i]); // Push course obj to selected list
                                    RootData.setCourses($scope.selected_courses);
                                    console.log(response.data[i]);
                                }
                            }


                        }),
                        function (response) { // optional
                            console.log(response);
                        };
                };
            })

    .controller('DashDetailCtrl', function ($scope, $http, $stateParams, RootData) {
        $scope.course_info = RootData.getSelectedCourse();

        $scope.courses = [];
        $scope.selected_courses = [];


        $scope.getCourse = function (course_code) {
            $http({
                url: 'http://unitime.se/api/course/',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                method: "POST",
                dataType: 'json',
                async: false,
                transformRequest: function (obj) {
                    var str = [];
                    for (var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                data: {course: course_code}
            })
                .then(function (response) {
                    for (var i = 0; i < response.data.length; i++) {

                        // If course is already added to selected_courses list
                        if (_.contains(_.map($scope.selected_courses, function (course) {
                                return course.course_code;
                            }), response.data[i]['course_code'])) {
                        }
                        else {
                            $scope.selected_courses.push(response.data[i]); // Push course obj to selected list
                            RootData.setCourses($scope.selected_courses);
                            console.log(response.data[i]);
                        }
                    }


                }),
                function (response) { // optional
                    console.log(response);
                };
        };
    })

            .controller('AccountCtrl', function ($scope) {
                $scope.settings = {
                    enableFriends: true
                };
            });






