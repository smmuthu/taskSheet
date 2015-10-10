app.controller('userEditCtrl',function ($auth, $state, $http, $rootScope, $scope, $modal, $filter, alertsManager, $location) {
    $scope.loading = false ;
    $scope.alerts = alertsManager.alerts;
    $scope.sex = {
        availableOptions: [
          {id: '1', name: 'Male'},
          {id: '2', name: 'Female'},
        ]
    };
    $scope.tabs = {
        first: 'btn-primary',
        second: 'btn-default',
        third: 'btn-default',
    };
    
    if(!$auth.isAuthenticated()){
            $state.go('login');
    }else if($state.params.id){
        //alert($location.path());
        //$state.go('dashbord.useredit',{ id: $state.params.id});
        $http.get(apibaseurl+'api/user/'+$state.params.id)
            .success(function (data) {
            $scope.firstname = data.user.firstname;
            $scope.lastname = data.user.lastname;
            $scope.email = data.user.email;
            $scope.role = data.user.roles[0];
            $scope.formData = data.user;
            spliteddate = $scope.formData.dob.split(' ');
            $scope.formData.dob = spliteddate[0];
            $scope.formData.sex = {id:$scope.formData.sex};
        });
    }


    $scope.changetab = function(tab) {
        if(tab==1){
            $scope.tabs.first = 'btn-primary';
            $scope.tabs.second = 'btn-default';
            $scope.tabs.third = 'btn-default';
        }else if(tab==2){
            $scope.tabs.first = 'btn-default';
            $scope.tabs.second = 'btn-primary';
            $scope.tabs.third = 'btn-default';
        }else if(tab==3){
            $scope.tabs.first = 'btn-default';
            $scope.tabs.second = 'btn-default';
            $scope.tabs.third = 'btn-primary';
        }
    }
    //$scope.sexoptions = [{'Male'},{'Female'}];
    $scope.init = function() { }
    
    $scope.dateOptions = {
        startingDay: 1
    };
    $scope.status = {
        opened: false
    };
    
    $scope.open = function($event) {
        $scope.status.opened = true;
    };
    $scope.clearalert = function(key){
        alertsManager.deleteAlert(key);
    };
    // form submit
    $scope.submitForm = function(isValid) {
      if (isValid) {
            alertsManager.clearAlerts();
            $scope.loading = true ;
            $scope.formData.role = $scope.role.id;
            userObject = $scope.formData;
            userObject.sex = $scope.formData.sex.id;
            $http.put(apibaseurl+'api/user/'+$state.params.id,userObject)
                .success(function (data) {
                    alertsManager.addAlert(data.message, 'alert-success');
                    $scope.firstname = data.user.firstname;
                    $scope.lastname = data.user.lastname;
                    $scope.email = data.user.email;
                    $scope.role = data.user.roles[0];
                    $scope.formData = data.user;
                    spliteddate = $scope.formData.dob.split(' ');
                    $scope.formData.dob = spliteddate[0];
                    $scope.loading = false ;
                    $scope.formData.sex = {id:$scope.formData.sex};
                });
        }else{
            
        }
    };

    $scope.deleteUser = function (userId) {
        if(userId){
            $http.delete(apibaseurl+'api/user/'+userId)
            .success(function (data) {
                alertsManager.addAlert(data.message, 'alert-success');
                $state.go('dashboard.users');
            });
        }
    };

    $scope.resetConfirmation = function(){
        $scope.formData.confirm_password = '';
    }
    $scope.init();
});