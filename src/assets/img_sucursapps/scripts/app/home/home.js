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
            templateUrl: 'pages/2_0/accounts-detail.html',
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
