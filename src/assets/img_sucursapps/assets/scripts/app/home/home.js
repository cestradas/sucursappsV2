'use strict';

angular.module('SucursApps')
  .config(function($stateProvider) {
    $stateProvider
      .state('home', {
        parent: 'site',
        url: '/home',
        data: {
          roles: []
        },
        views: {
          'fullscreen@': {
            templateUrl: 'scripts/app/home/home.html',
            controller: 'HomeController'
          }
        },
        resolve: {
          DevicesServices: ['SucursAppsDevices',
            function(SucursAppsDevices) {
              return SucursAppsDevices.getInstance();
            }
          ]
        }

      });
  });
