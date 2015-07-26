//'use strict';
// Services

// NOT USED AT THE MOMENT
angular.module('unitime.services', ['ngResource'])

    .service('CourseService', function(Course, RootData){
        return {
            getItem: function(){

                if (RootData.getAllCourses().length == 0){

                    response = Course.query().$promise;
                    RootData.setAllCourses(response);
                    return response;

                }
                else {
                    return RootData.getAllCourses();
                }
            }
        }
    });

