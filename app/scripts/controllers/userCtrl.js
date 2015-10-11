angular.module('taskSheetApp').controller('userCtrl',function ($auth, $state, $http, $rootScope, $scope, $location, atomicNotifyService) {
    
    if(!$auth.isAuthenticated()){
            $state.go('login');
        }else if($location.path()=='/user/add'){
            $state.go('main.adduser');
            $scope.formData={};
            $scope.sex = {
                availableOptions: [
                  {id: '1', name: 'Male'},
                  {id: '2', name: 'Female'},
                ]
            };
            $scope.formData.sex = {id:1};
            $scope.selectedrole = {id:1};

        }else if($location.path()=='/users'){
            $state.go('main.users');
            $http.get(apibaseurl+'api/user')
                .success(function (data) {
                $scope.rowCollection = data.users;
                $scope.displayCollection = [].concat($scope.rowCollection);
            });
        }

    $scope.init = function() {
    }
    $scope.cancel = function(type) {
        if(type=='newuser'){
            atomicNotifyService.info('Add user has been cancelled!', 3000);
        }
    }
    // form submit
    $scope.submitForm = function(isValid) {
      if (isValid) {
            $scope.loading = true ;
            userObject = $scope.formData;
            userObject.role = $scope.selectedrole.id;
            userObject.sex = $scope.formData.sex.id;
            $http.post(apibaseurl+'api/user',userObject)
                .success(function (data) {
                    atomicNotifyService.success(data.message, 3000);
                    $state.go('main.userview', {id: data.user.id});
                });
        }
    };
    //ad user functions ends
    //delete user
    $scope.deleteUser = function (userId) {
        alert(userId);
        if(userId){
            $http.delete(apibaseurl+'api/user/'+userId)
            .success(function (data) {
                $state.go('main.users');
            });
        }
    };
    $scope.init();
});