angular.module('myApp.services', ['ngResource'])

    .factory('Course', function($resource){
        return $resource('http://unitime.se/api/course/', {}, {
            query: {method:"GET", isArray:true}
        });
    });