
angular.module('factories',[
    'ngResource'
])

    // Factory for getting course and courses
    .factory('Course', ['$resource', function($resource){


        return $resource('http://unitime.se/api/course/:course',
            {},
            {'get': {method: 'GET', isArray: true}
        });
    }]);