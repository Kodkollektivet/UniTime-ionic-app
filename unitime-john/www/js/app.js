// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('unitime', [
    'ionic',
    'unitime.controllers',
    'unitime.services',
    'unitime.factorys',
    'jett.ionic.filter.bar'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom');

        // Ionic Filter bar config
        /*
         $ionicFilterBarConfigProvider.theme('calm');
         $ionicFilterBarConfigProvider.clear('ion-close');
         $ionicFilterBarConfigProvider.search('ion-search');
         */
        $ionicFilterBarConfigProvider.placeholder('Filter');
        $ionicFilterBarConfigProvider.backdrop(false);
        $ionicFilterBarConfigProvider.transition('horizontal');


  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

      // setup an abstract state for the tabs directive
      .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.courses', {
          url: '/courses',
          views: {
              'tab-courses': {
                  templateUrl: 'templates/tab-courses.html'
                  //controller: 'CourseController'
              }
          }
      })

      .state('tab.courses-list', {
          url: '/courses-list',
          views: {
              'tab-courses': {
                  templateUrl: 'templates/tab-courses-list.html',
                  controller: 'CourseController'
              }
          },
          resolve: {
              item: function(CourseService) {
                  return CourseService.getItem();
              }
          }
      })

      .state('tab.courses-my', {
          url: '/courses-my',
          views: {
              'tab-courses': {
                  templateUrl: 'templates/tab-courses-my.html',
                  controller: 'MyCoursesController'
              }
          }
      })
      .state('tab.course-detail', {
          url: '/courses-detail',
          views: {
              'tab-courses': {
                  templateUrl: 'templates/tab-course-detail.html',
                  controller: 'DetailCourseController'
              }
          }
      })

      .state('tab.events', {
          url: '/events',
          views: {
              'tab-events': {
                  templateUrl: 'templates/tab-events.html',
                  controller: 'EventsController'
              }
          }
      })

      .state('tab.event-detail', {
          url: '/event-detail',
          views: {
              'tab-events': {
                  templateUrl: 'templates/tab-event-detail.html',
                  controller: 'EventsController'
              }
          }
      })

      .state('tab.calendar', {
          url: '/calendar',
          views: {
              'tab-calendar': {
                  templateUrl: 'templates/tab-calendar.html',
                  controller: 'CalendarCtrl'
              }
          }
      })

      .state('tab.info', {
          url: '/info',
          views: {
              'tab-info': {
                  templateUrl: 'templates/tab-info.html'
                  //controller: 'EventsController'
              }
          }
      });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/events');

});
