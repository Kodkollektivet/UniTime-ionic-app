
angular.module('services', ['ngResource'])

    .service('CourseService', function(Course, RootData){
        return {
            getItem: function(){

                console.log(RootData.getAllCourses().length);

                if (RootData.getAllCourses().length == 0){

                    response = Course.query().$promise;
                    RootData.setAllCourses(response);
                    return response;

                }
                else {
                    console.log('Root data lenght is NOT 0');
                    return RootData.getAllCourses();
                }
            }
        }
    })

// return Course.get({course:course['1BD105']});

    .service('ItemsService', function($q) {
        return {
            getItem: function() {
                var dfd = $q.defer();

                setTimeout(function() {
                    dfd.resolve({
                        name: 'Mittens Cat'
                    })
                }, 2000);
                console.log('In ItemServices');
                return dfd.promise;
            }
        }
    });