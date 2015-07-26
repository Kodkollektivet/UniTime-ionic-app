
angular.module('controllers', [])

    .controller('EventController', ['$scope', 'item', function($scope, item){
        $scope.items = item;  // This is the object that is comming from the resolve
        $scope.hejsan = 'Hejsan';  // This is a static scope variable
        console.log(item);
    }]);