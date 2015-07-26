// This is used to fetch data from resourses
// There is a dependencie here: ngResourse
// The Course object is called from app.js
// That call is a resolve that injects data to the controller
angular.module('factories',[
    'ngResource'
])

    // Factory for getting course and courses
    .factory('Course', ['$resource', function($resource){


        return $resource('http://unitime.se/api/course/:course',
            {},
            {'get': {method: 'GET', isArray: true}
        });
    }])


    // RootData factory, for transporting data between scopes
    .factory('RootData', function(){
        var allCourses = [];  // All courses list
        var myCourses = [];  // My selected courses
        var course;  // Single course object
        var events;  // Events list
        var event;  // Single event object
        return {
            setAllCourses: function(dataIn){
                allCourses = dataIn;
            },
            getAllCourses: function(){
                return allCourses;
            },
            setMyCourses: function(dataIn){
                myCourses = dataIn;
            },
            getMyCourses: function(){
                return myCourses;
            },
            setCourse: function(dataIn){
                course = dataIn;
            },
            getCourse: function(){
                return course
            },
            setEvents: function(dataIn){
                events = dataIn;
            },
            getEvents: function(){
                return events;
            },
            setEvent: function(dataIn){
                event = dataIn;
            },
            getEvent: function(){
                return event;
            }
        };
    });