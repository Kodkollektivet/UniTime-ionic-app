
angular.module('controllers', [])

    .controller('EventController', ['$scope', 'item', function($scope, item){
        $scope.items = item;
        $scope.hejsan = 'Hejsan';
        console.log('In EventController');
    }]);