angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $state, Course, Event, RootData) {
        $scope.selectedCourses = RootData.getSelectedCourses();
    })

.controller('ChatsCtrl', function($scope, $state, Course, Event, RootData) {
        $scope.allCourses;  // All courses
        $scope.course;  // Specific course object

        // This gets all the courses
        Course.query(function(response){
            $scope.allCourses = response;
        });

        // Get a specific course
        $scope.getCourse = function(course_code) {
            Course.get({course:course_code},function(response){
                $scope.course = response[0];  // We are getting a list from tha API but only one abject in the list
                RootData.setCourse($scope.course);  // Add course to RootData
                $state.go('tab.chat-detail');
            });
        }
})

.controller('ChatDetailCtrl', function($scope, $state, RootData) {
        $scope.course = RootData.getCourse();

        $scope.addCourseToSelectedCourses = function(course){
            RootData.setSelectedCourses = RootData.getSelectedCourses().push(course);
        }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
