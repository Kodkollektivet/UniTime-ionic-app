angular.module('myApp.services', ['ngResource'])

    .factory('Course', function($resource){
        return $resource('http://unitime.se/api/course/:course', {}, {
            'get': {method: 'GET', isArray: true}
        });
    })
    .factory('Event', function($resource){
        return $resource('http://unitime.se/api/event/:course', {}, {
            'get': {method:'GET', isArray: true}
        });
    });