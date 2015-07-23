'use strict';
// Services

// NOT USED AT THE MOMENT
angular.module('unitime.services', ['ngResource'])
    .service('EventService', function(RootData, Event, $q){
        return {
            getEvents: function(){

                var dfd = $q.defer()
                var events = [];
                console.log('in EventService');
                console.log(RootData.getMyCourses().length);
                if (RootData.getMyCourses().length > 0){
                    angular.forEach(RootData.getMyCourses(), function(course){
                        console.log(course['course_code']);
                        Event.get({course:course['course_code']},function(response){

                            angular.forEach(response, function(event){
                                events.push(event);
                                console.log(event);
                            });
                        });
                    });

                    dfd.resolve(events);
                    return dfd.promise;
                }

                else {

                    return dfd.promise;
                    return events;
                }
            }
        }
    });


