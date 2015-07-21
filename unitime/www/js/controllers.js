angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope, Data) {
      $scope.printDashScope = function(){
        console.log('i am in printDashScope');
        console.log(Data.getData());
      }
    })

.controller('ChatsCtrl', function($scope, $http, Chats, Course, Data) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});



      $scope.courses = [];
      $scope.selected_courses = [];

      Course.query(function(response){
        for (var i = 0 ; i < response.length ; i++){
          $scope.courses.push(response[i]);
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
          transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
              str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          },
          data: {course: course_code}
        })
            .then(function(response) {
              for ( var i = 0 ; i < response.data.length ; i++){

                // If course is already added to selected_courses list
                if(_.contains(_.map($scope.selected_courses, function(course){
                      return course.course_code;
                    }), response.data[i]['course_code'])){
                }
                else{
                  $scope.selected_courses.push(response.data[i]); // Push course obj to selected list
                  Data.setData($scope.selected_courses);
                  console.log(response.data[i]);
                }
              }


            },
            function(response) { // optional
              console.log(response);
            });
      };


      $scope.printData = function(){
          console.log(Data.getData());
      };

      $scope.chats = Chats.all();
      $scope.remove = function(chat) {
        Chats.remove(chat);
      };


    })







    .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
      $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function($scope) {
      $scope.settings = {
        enableFriends: true
      };
});
