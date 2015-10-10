angular.module('taskSheetApp').controller('authCtlr',  function ($auth, $state, $http, $rootScope, $timeout, $scope) {
    $rootScope.bodyclass='hold-transition login-page'
    $scope.email='';
    $scope.password='';
    $scope.newUser={};
    $scope.loginError=false;
    $scope.loginErrorText='';
    $scope.loginSuccess=false;
    $scope.loginSuccessText='';
    $scope.avclass='';
    $scope.init = function() {
        if($auth.isAuthenticated()){
            $state.go('main.dashboard');
        }
    }
    $scope.login = function() {
        if($scope.email==''){
            $scope.loginError = true;
            $scope.loginErrorText = 'Email is mandatory!';
            return false;
        }else if($scope.password==''){
            $scope.loginError = true;
            $scope.loginErrorText = 'Password is mandatory!';
            return false;
        }

        var credentials = {
            email: $scope.email,
            password: $scope.password
        }

        $auth.login(credentials).then(function() {
            return $http.get(apibaseurl+'api/authenticate/user');

        }, function(error) {
            $scope.avclass='error';
            if(error.status==0){ // netwok errors
                $scope.loginError = true;
                $scope.loginErrorText = "No internet connection or unable to connect the server.";
            }else{ //system errors
                $scope.loginError = true;
                $scope.loginErrorText = error.data.error;

            }

        }).then(function(response) {
            $rootScope.currentUser = response.data.user;
            $scope.loginError = false;
            $scope.loginErrorText = '';
            $scope.loginSuccess=true;
            $scope.loginSuccessText='Logged In success please wait...';
            $scope.avclass='success';
            $scope.avatarImage='images/generic.jpg';
            $timeout(function() {
                $state.go('main.dashboard');
            }, 2000);
        });
    }

    $scope.register = function () {

        $http.post(apibaseurl+'/api/register',$scope.newUser)
            .success(function(data){
                $scope.email=$scope.newUser.email;
                $scope.password=$scope.newUser.password;
                $scope.login();
        })

    };
    $scope.init();
});