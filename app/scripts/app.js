'use strict';

/**
 * @ngdoc overview
 * @name ngApp
 * @description
 * # ngApp
 *
 * Main module of the application.
 */
var apibaseurl = 'http://localhost:8000/';
angular.module('taskSheetApp', ['smart-table', 'oc.lazyLoad', 'ui.router', 'satellizer', 'angular-loading-bar', 'ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch'])
  .config(function ($ocLazyLoadProvider, $stateProvider, $urlRouterProvider, $authProvider, $provide) {
      $authProvider.httpInterceptor = true;
      $authProvider.withCredentials = true;
      $authProvider.tokenRoot = null;
      $authProvider.cordova = false;
      $authProvider.baseUrl = apibaseurl;
      $authProvider.loginUrl = '/api/authenticate';
      $authProvider.signupUrl = '/auth/signup';
      $authProvider.unlinkUrl = '/auth/unlink/';
      $authProvider.tokenName = 'token';
      $authProvider.tokenPrefix = 'satellizer';
      $authProvider.authHeader = 'Authorization';
      $authProvider.authToken = 'Bearer';
      $authProvider.storageType = 'localStorage';
      function redirectWhenLoggedOut($q, $injector) {
          return {
              responseError: function (rejection) {
                  var $state = $injector.get('$state');
                  var rejectionReasons = ['token_not_provided', 'token_expired', 'token_absent', 'token_invalid'];

                  angular.forEach(rejectionReasons, function (value, key) {
                      if (rejection.data.error === value) {
                          localStorage.removeItem('user');
                          $state.go('login');
                      }
                  });

                  return $q.reject(rejection);
              }
          }
      }
      $provide.factory('redirectWhenLoggedOut', redirectWhenLoggedOut);
      $urlRouterProvider.otherwise('/user/login');
      $stateProvider.state('login', {
        url: '/user/login',
        controller: 'authCtlr',
        templateUrl: 'views/user/login.html',
        resolve: {
                    loadMyFiles:function($ocLazyLoad) {
                      return $ocLazyLoad.load({
                        name:'taskSheetApp',
                        files:[
                        'scripts/controllers/authCtlr.js',
                        'styles/theme/AdminLTE.min.css',
                        'styles/theme/_all-skins.min.css',
                        ]
                      });
                    },
                  }
      });
      $stateProvider.state('main', {
        url: '/',
        controller: 'mainCtlr',
        templateUrl: 'views/main.html',
        resolve: {
                    loadMyFiles:function($ocLazyLoad) {
                      return $ocLazyLoad.load({
                        name:'taskSheetApp',
                        files:[
                        'scripts/controllers/mainCtlr.js',
                        'scripts/theme/theme.js',
                        'scripts/theme/demo.js',
                        'styles/theme/AdminLTE.min.css',
                        'styles/theme/_all-skins.min.css',
                        ]
                      });
                    },
                  }
      })
      .state('main.dashboard',{
        url: 'dashboard',
      })
      .state('main.users',{
                url:'users',
                controller: 'userCtrl',
                templateUrl:'views/user/list.html',
                resolve: {
                  loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                      name:'taskSheetApp',
                      files:[
                      'scripts/controllers/userCtrl.js',
                      ]
                    })
                  }
                }
              });
  })  
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }]);
