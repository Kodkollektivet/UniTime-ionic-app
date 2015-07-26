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
    .factory('RootData', function($localstorage, Event){
        var allCourses = [];  // All courses list
        var myCourses = [];  //My courses list
        var course;  // Single course object
        var events = [];  // Events list
        var event;  // Single event object
        return {
            setAllCourses: function(dataIn){
                allCourses = dataIn;
            },
            getAllCourses: function(){
                return allCourses;
            },
            setMyCourses: function(dataIn){
                myCourses.push(dataIn);
                $localstorage.setObject('myCourses', myCourses);
            },
            getMyCourses: function(){
                if ($localstorage.getObject('myCourses') == null) {
                    return [];  // My selected courses
                }
                else {
                    return $localstorage.getObject('myCourses');
                }
            },
            removeFromMyCourses: function(dataIn){
                myCourses.splice(myCourses.indexOf(dataIn), 1);
                $localstorage.setObject('myCourses', myCourses);
                angular.forEach(events, function (event) {
                    if (event.course_code == dataIn.course_code) {
                        events.splice(events.indexOf(event), 1);
                    }
                })
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
                //return events;
                events = [];
                angular.forEach(this.getMyCourses(), function(course){

                    // Send get request to API, reponse will be a list of event objects
                    Event.get({course:course['course_code']},function(response){

                        // Iterate over response and add events to events list
                        angular.forEach(response, function(event){
                            var date = event['startdate'].split('-');

                            var starttime = event['starttime'].split(':');
                            var endtime = event['endtime'].split(':');
                            var start_datetime = new Date(date[0], date[1]-1, date[2], starttime[0], starttime[1]);
                            var end_datetime = new Date(date[0], date[1]-1, date[2], endtime[0], endtime[1]);
                            var start_date = new Date(date[0], date[1]-1, date[2]).setHours(0,0,0,0);
                            event['date'] = start_date;
                            event['start_datetime'] = start_datetime;
                            event['end_datetime'] = end_datetime;

                            // Add event to list
                            events.push(event);
                        });
                    });
                });
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

