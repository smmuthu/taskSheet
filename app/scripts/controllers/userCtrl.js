angular.module('taskSheetApp').controller('userCtrl',function ($auth, $state, $http, $rootScope, $scope, $location) {
    
    if(!$auth.isAuthenticated()){
            $state.go('login');
        }else if($location.path()=='/dashboard/user/add'){
            $state.go('dashboard.useradd');
            $scope.formData={};
            $scope.sex = {
                availableOptions: [
                  {id: '1', name: 'Male'},
                  {id: '2', name: 'Female'},
                ]
            };
            //$scope.availableRoles = appdata.allroles;
            //console.log($scope.availableRoles);
            $scope.formData.sex = {id:1};
            $scope.selectedrole = {id:1};

        }else if($location.path()=='/users'){
            $state.go('main.users');
            $http.get(apibaseurl+'api/user')
                .success(function (data) {
                $scope.rowCollection = data.users;
                $scope.displayCollection = [].concat($scope.rowCollection);
                console.log($scope.displayCollection);
            });
        }

    $scope.init = function() {
    }
    
    // add user functions
    $scope.clearalert = function(key){
        alertsManager.deleteAlert(key);
    };
    // form submit
    $scope.submitForm = function(isValid) {
      if (isValid) {
            console.log($scope.selectedrole);
            console.log($scope.formData.role);
            alertsManager.clearAlerts();
            $scope.loading = true ;
            userObject = $scope.formData;
            userObject.role = $scope.selectedrole.id;
            userObject.sex = $scope.formData.sex.id;
            $http.post(apibaseurl+'api/user',userObject)
                .success(function (data) {
                    alertsManager.addAlert(data.message, 'alert-success');
                    $state.go('dashboard.useredit', {id: data.user.id});
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
                alertsManager.addAlert(data.message, 'alert-success');
                $state.go('dashboard.users');
            });
        }
    };
    $scope.init();
});