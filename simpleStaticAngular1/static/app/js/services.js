angular.module('myApp.services', ['ngResource'])

    .factory('Course', function($resource){
        return $resource('http://127.0.0.1:8000/api/course/:course', {}, {
            'get': {method: 'GET', isArray: true}
        });
    })
    .factory('Event', function($resource){
        return $resource('http://127.0.0.1:8000/api/event/:course', {}, {
            'get': {method:'GET', isArray: true}
        });
    });