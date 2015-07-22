angular.module('starter.services', ['ngResource'])

    // Factory for getting course and courses
    .factory('Course', function($resource){
        return $resource('http://unitime.se/api/course/:course', {}, {
            'get': {method: 'GET', isArray: true}
        });
    })

    // Factory for getting events
    .factory('Event', function($resource){
        return $resource('http://unitime.se/api/event/:course', {}, {
            'get': {method:'GET', isArray: true}
        })
    })

    // RootData factory, for transporting data between scopes
    .factory('RootData', function(){
        var allCourses;
        var selectedCourses;
        var course;
        var events;
        return {
            setAllCourses: function(dataIn){
                allCourses = dataIn;
            },
            getAllCourses: function(){
                return allCourses;
            },

            setSelectedCourses: function(dataIn){
                selectedCourses = dataIn;
            },
            getSelectedCourses: function(){
                return selectedCourses
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
            }

        };
    });

