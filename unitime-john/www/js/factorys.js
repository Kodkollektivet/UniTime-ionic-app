'use strict';
angular.module('unitime.factorys', ['ngResource'])

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
    .factory('RootData', function($localstorage){
        var allCourses = [];  // All courses list
        var myCourses = [];
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

            addToMyCourses: function(courseIn){

                if (!_.contains(_.map(myCourses, function(course){
                        return course.course_code;
                    }), courseIn.course_code)){

                    myCourses.push(courseIn);
                    console.log('Course added to my courses');
                    return true;
                }
                else {
                    console.log('Course NOT added, already in myCourses list');
                    return false;
                }


                //$localstorage.setObject('myCourses', myCourses);
            },

            removeFromMyCourses: function(courseIn){
                if (_.contains(_.map(myCourses, function(course){
                        return course.course_code;
                    }), courseIn.course_code)){

                    myCourses.splice(myCourses.indexOf(courseIn), 1);
                    console.log('Course removed from my courses');
                    return true;
                }
                else {
                    console.log('Course not removed');
                    return false;
                }
            },

            courseInMyCourses: function(courseIn){
                if (_.contains(_.map(myCourses, function(course){
                        return course.course_code;
                    }), courseIn.course_code)){
                    return true;
                }
                else {
                    return false;
                }
            },

            getMyCourses: function(){
                if ($localstorage.getObject('myCourses') == null) {
                    return [];  // My selected courses
                }
                else {
                    return myCourses;
                    //return $localstorage.getObject('myCourses');
                }
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
    })

    //Local Storage factory, used instead of database to persist data between uses
    .factory('$localstorage', ['$window', function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }]);

