app.controller('roleCtrl',function ($auth, $state, $http, $rootScope, $scope, $modal, $location, alertsManager) {
    
    if(!$auth.isAuthenticated()){
            $state.go('login');
        }else if($location.path()=='/dashboard/role/add'){
            $state.go('dashboard.roleadd');
            $scope.formData={};
        }else if($location.path()=='/dashboard/roles'){
            $state.go('dashboard.roles');
            $http.get(apibaseurl+'api/role')
                .success(function (data) {
                $scope.gridOptions.data = data.roles;
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

    $scope.gridOptions= {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        enablerowSelection: true,
        columnDefs: [
                        { name: 'name' },
                        { name: 'display_name' },
                        { name: 'description' },    
                        /*{ name: 'created_at' },
                        { name: 'updated_at' },*/
                        { field: 'id', name: '', enableSorting: false, enableFiltering: false, cellTemplate: 'tsa/views/dashboard/roles/editlink.html' }
                    ]
    };
    /*$scope.editRow = function (grid, row) {
        $modal.open({
          templateUrl: 'edit-modal.html',
          controller: ['$modalInstance', 'grid', 'row', UserEditCtrl],
          controllerAs: 'vm',
          resolve: {
            grid: function () { return grid; },
            row: function () { return row; }
          }
        });
    }*/
    $scope.init();
});