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

    // Factory for sending in course ratings
    .factory('Rate', function($resource){
        return $resource('http://unitime.se/api/rate/', {}, {
            'save': {method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                async: false,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                }
            }
        });
    })


    // RootData factory, for transporting data between scopes
    .factory('RootData', function($localstorage, Event, Course){
        var allCourses = [];  // All courses list
        var myCourses = [];  //My courses list
        var course;  // Single course object
        var events = [];  // Events list
        var event;  // Single event object

        var getEventsRequest = function () {
            events.splice(0, events.length);
            angular.forEach(getMyCourses(), function(course){

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
        };
        var getMyCourses = function(){
            var temp = $localstorage.getObject('myCourses');
            if ((temp == null) || (temp.length == 0)) {
                return myCourses;  // Returns a empty list
            }
            else {
                myCourses = temp;
                return myCourses;
            }
        };
        _.observe(myCourses, function(new_array, old_array) {
            getEventsRequest();
        });

        return {
            setAllCourses: function(dataIn){
                allCourses = dataIn;
            },
            getAllCourses: function(){
                return allCourses;
            },

            addToMyCourses: function(courseIn){
                /*
                 If myCourse list dont contain the courseIn object.
                 Add it to the list, save in localstorage and return true
                 else return false.
                 */

                // If myCourse not containing a object with same value, add to list
                if (!_.contains(_.map(myCourses, function(course){
                        return course.course_code;
                    }), courseIn.course_code)){

                    myCourses.push(courseIn);  // Save it to the list
                    $localstorage.setObject('myCourses', myCourses);
                    return true;
                }
                else {
                    return false;
                }
            },

            removeFromMyCourses: function(courseIn){
                if (_.contains(_.map(myCourses, function(course){
                        return course.course_code;
                    }), courseIn.course_code)){

                    myCourses.splice(myCourses.indexOf(courseIn), 1);
                    $localstorage.setObject('myCourses', myCourses);
                    return true;
                }
                else {
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
                if ($localstorage.getObject('myCourses' == null)) {
                    return myCourses;  // Returns a empty list
                }
                else {
                    myCourses = $localstorage.getObject('myCourses');
                    return myCourses;
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

