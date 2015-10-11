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
angular.module('taskSheetApp', ['smart-table', 'oc.lazyLoad', 'ui.router', 'satellizer', 'angular-loading-bar', 'ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch','ui.bootstrap', 'atomic-notify', 'hSweetAlert', 'ngImgCrop'])
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
              })
      .state('main.userview',{
                url:'user/view/:id',
                controller: 'profileCtrl',
                templateUrl:'views/user/profile.html',
                resolve: {
                  loadMyFiles:function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                      name:'taskSheetApp',
                      files:[
                      'scripts/controllers/profileCtrl.js',
                      'styles/theme/AdminLTE.min.css',
                      'styles/theme/_all-skins.min.css',
                      ]
                    })
                  }
                }
              })
      .state('main.adduser',{
                url:'user/add',
                controller: 'userCtrl',
                templateUrl:'views/user/new.html',
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
  }])
  .config(['atomicNotifyProvider', function(atomicNotifyProvider){
    atomicNotifyProvider.setDefaultDelay(3000);
    atomicNotifyProvider.useIconOnNotification(true);
  }]);


  // other directives
  angular.module('taskSheetApp').factory('dataService', ['$http', function ($http) {
        var serviceBase = apibaseurl+'api/user/',
            dataFactory = {};

        dataFactory.checkUniqueValue = function (id, property, value) {
            if (!id) id = 0;
            return $http.get(serviceBase+'checkunique/'+ id +'/'+ property + '/' + escape(value)).then(
                function (results) {
                    return results.data.status;
                });
        };

        dataFactory.getRoles = function () {
            return $http.get(serviceBase +'allroles').then(
                function (results) {
                    return results.data.roles;
                });
        };

        return dataFactory;
    }]);
    angular.module('taskSheetApp').directive('roles', ['dataService', function (dataService) {
        return {
            template: '<select name="role" class="form-control" ng-model="selectedrole" ng-options="c.display_name for c in roles track by c.id"></select>',
            restrict: 'E',
            scope: {
               selectedrole: '='
            },
            link:function(scope,elem,attrs){
                dataService.getRoles()
                .then(function (allroles){
                    scope.roles = allroles;
                    scope.selectedrole=scope.roles[0];
                });
                
            }
        };
    }]);
    // email availability checking directive
    angular.module('taskSheetApp').directive('wcUnique', ['dataService', function (dataService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                element.bind('change', function (e) {
                    if (!ngModel || !element.val()) return;
                    var keyProperty = scope.$eval(attrs.wcUnique);
                    var currentValue = element.val();
                    dataService.checkUniqueValue(keyProperty.key, keyProperty.property, currentValue)
                        .then(function (unique) {
                            //Ensure value that being checked hasn't changed
                            //since the Ajax call was made
                            if (currentValue == element.val()) { 
                                ngModel.$setValidity('unique', unique);
                            }
                        }, function () {
                            //Probably want a more robust way to handle an error
                            //For this demo we'll set unique to true though
                            ngModel.$setValidity('unique', true);
                        });
                });
            }
        }
    }]);

(function () {
    'use strict';
    var directiveId = 'ngMatch';
    angular.module('taskSheetApp').directive(directiveId, ['$parse', function ($parse) {
        var directive = {
            link: link,
            restrict: 'A',
            require: '?ngModel'
        };
        return directive;

        function link(scope, elem, attrs, ctrl) {
        // if ngModel is not defined, we don't need to do anything
            if (!ctrl) return;
            if (!attrs[directiveId]) return;

            var firstPassword = $parse(attrs[directiveId]);
            var validator = function (value) {
                var temp = firstPassword(scope),
                v = value === temp;
                ctrl.$setValidity('match', v);
                return value;
            }

            ctrl.$parsers.unshift(validator);
            ctrl.$formatters.push(validator);
            attrs.$observe(directiveId, function () {
                validator(ctrl.$viewValue);
            });
        }
    }]);
})();