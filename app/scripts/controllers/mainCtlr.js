'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngApp
 */
angular.module('taskSheetApp')
  .controller('mainCtlr', function ($auth, $state, $scope, $rootScope) {
  	$rootScope.bodyclass =  'hold-transition skin-blue sidebar-mini';
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.init = function() {
        if(!$auth.isAuthenticated()){
            $state.go('login');
        }
    }
    $scope.init();
  });
