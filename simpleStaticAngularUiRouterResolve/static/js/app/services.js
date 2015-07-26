
angular.module('services', ['ngResource'])

    .service('CourseService', function($q){
        return {
            getItem: function() {
                var dfd = $q.defer();

                setTimeout(function() {
                    dfd.resolve({
                        name: 'Mittens Cat'
                    })
                }, 1000);
                console.log('In ItemServices');
                return dfd.promise;
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