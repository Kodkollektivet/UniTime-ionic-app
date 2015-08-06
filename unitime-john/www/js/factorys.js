'use strict';
angular.module('unitime.factorys', ['ngResource'])

    // Factory for getting course and courses
    .factory('Course', function($resource){
        return $resource('http://unitime.se/api/course/:course', {}, {
            'get': {method: 'GET', isArray: true}
        });
    })


    .factory('PdfGetter', function($resource) {
        return $resource('http://unitime.se/api/pdf/', {}, {
            'save': {method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                async: false,
                responseType: 'arraybuffer',
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                transformResponse: function(data, headersGetter) {
                    // Stores the ArrayBuffer object in a property called "data"
                    return { data : data };
                }
            }

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
        var myCourses = $localstorage.getObject('myCourses');  //My courses list
        var course;  // Single course object
        var events = [];  // Events list
        var event;  // Single event object
        var syllabus = null;

        var checkDate = null;

        var checkIfNewDate = function (event) {
            if (checkDate == null || checkDate.getTime() < event['date'].getTime()) {
                checkDate = event['date'];
                return true;
            }
            return false;
        };

        var sortDates = function (date1, date2) {
            if(date1['date'].getTime() < date2['date'].getTime()) return -1;
            if(date1['date'].getTime() > date2['date'].getTime()) return 1;
            return 0;
        };

        var getEventsRequest = function () {
            checkDate = null;
            events.splice(0, events.length);
            angular.forEach(myCourses, function(course){

                // Send get request to API, reponse will be a list of event objects
                Event.get({course:course['course_code']},function(response){

                    // Iterate over response and add events to events list
                    angular.forEach(response, function(event){
                        var date = moment(event['startdate']).toDate();
                        var start_datetime = moment(event['startdate'] + " " + event['starttime']).toDate();
                        var end_datetime = moment(event['startdate'] + " " + event['endtime']).toDate();

                        event['date'] = date;
                        event['start_datetime'] = start_datetime;
                        event['end_datetime'] = end_datetime;

                        event['newDate'] = checkIfNewDate(event);

                        // Add event to list
                        events.push(event);
                    });
                });
            });
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
            },
            getEventsRefresh: function () {
                getEventsRequest();
                return events;
            },
            setSyllabus: function (url) {
                syllabus = url;
            },
            getSyllabus: function () {
                return syllabus;
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
                return JSON.parse($window.localStorage[key] || '[]');
            }
        }
    }]);

