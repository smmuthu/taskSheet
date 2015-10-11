angular.module('taskSheetApp').controller('profileCtrl',function ($auth, $state, $http, $rootScope, $scope, $filter, $location, atomicNotifyService, sweet) {
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
    $scope.formData = {};
    $scope.profileFormData = {};
    $scope.profileBoxData = {};
    $scope.aboutmeBoxData = {};
    if(!$auth.isAuthenticated()){
            $state.go('login');
    }else if($state.params.id){
        //alert($location.path());
        //$state.go('dashbord.useredit',{ id: $state.params.id});
        $http.get(apibaseurl+'api/user/'+$state.params.id)
            .then(function successCallback(response) {
                data = response.data;
                if(data.error== true){
                    atomicNotifyService.error(data.message, 3000);
                    $state.go('main.users');
                }else{
                    // Profile ox data - starts
                    $scope.profileBoxData.firstname = data.user.firstname;
                    $scope.profileBoxData.lastname = data.user.lastname;
                    $scope.profileBoxData.team = 'Team A';
                    $scope.profileBoxData.position = 'Developer';
                    $scope.profileBoxData.role = data.user.roles[0].display_name;
                    $scope.profileBoxData.projects = '50';
                    $scope.profileBoxData.tasks = '1000';
                    $scope.profileBoxData.earned = '50000';
                    // Profile ox data - ends
                    // form data -starts
                    $scope.firstname = data.user.firstname;
                    $scope.lastname = data.user.lastname;
                    $scope.email = data.user.email;
                    $scope.role = data.user.roles[0];
                    $scope.formData = data.user;
                    spliteddate = $scope.formData.dob.split(' ');
                    $scope.formData.dob = spliteddate[0];
                    $scope.formData.sex = {id:$scope.formData.sex};
                    // form data -ends
                    //about me data -starts
                    $scope.aboutmeBoxData.education = 'B.S. in Computer Science from the University of Tennessee at Knoxville';
                    $scope.aboutmeBoxData.location = data.user.city+', '+data.user.state+', '+data.user.country;
                    $scope.aboutmeBoxData.notes = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam fermentum enim neque.';
                    //about me data -ends

                    //profile form data -starts
                    $scope.myImage='';
                    $scope.myCroppedImage='';
                    $scope.profileFormData.skills = data.user.skills; 
                    $scope.profileFormData.education = data.user.education; 
                    $scope.profileFormData.about_me = data.user.about_me; 
                    //profile form data -ends
                    var handleFileSelect=function(evt) {
                      var file=evt.currentTarget.files[0];
                      var reader = new FileReader();
                      reader.onload = function (evt) {
                        $scope.$apply(function($scope){
                          $scope.myImage=evt.target.result;
                        });
                      };
                      reader.readAsDataURL(file);
                    };
                    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);
                }
            },
            function errorCallback(response) {
                data = response.data;
                if(data.error){
                    atomicNotifyService.error(data.message, 3000);
                    $state.go('main.users');
                }else{
                    atomicNotifyService.error('Something went wrong!', 3000);
                    $state.go('main.users');
                }
            });
    }

    //$scope.sexoptions = [{'Male'},{'Female'}];
    $scope.init = function() {
        $scope.profileFormData = {};
    };
    
    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.cancel = function(type) {
        if(type=='edituser'){
            atomicNotifyService.info('The edited user data has been cancelled!', 3000);
        }
    }
    $scope.submitProfileForm = function(isValid) {
        if (isValid) {
            profileObject = $scope.profileFormData;
            console.log($scope.profileFormData);
            $http.put(apibaseurl+'api/user/'+$state.params.id,profileObject)
            .then(function successCallback(response) {
                data = response.data;
                atomicNotifyService.success(data.message, 3000);
            },
            function errorCallback(response) {
                data = response.data;
                if(data){
                    atomicNotifyService.error(data.message, 3000);
                }else{
                    atomicNotifyService.error('Something went wrong!', 3000);
                }
            });
        }
    }
    // form submit
    $scope.submitForm = function(isValid) {
      if (isValid) {
            $scope.formData.role = $scope.role.id;
            userObject = $scope.formData;
            userObject.sex = $scope.formData.sex.id;
            $http.put(apibaseurl+'api/user/'+$state.params.id,userObject)
                .success(function (data) {
                    atomicNotifyService.success(data.message, 3000);
                    $scope.firstname = data.user.firstname;
                    $scope.lastname = data.user.lastname;
                    $scope.email = data.user.email;
                    $scope.role = data.user.roles[0];
                    $scope.formData = data.user;
                    spliteddate = $scope.formData.dob.split(' ');
                    $scope.formData.dob = spliteddate[0];
                    $scope.formData.sex = {id:$scope.formData.sex};
                });
        }else{
            
        }
    };

    $scope.deleteUser = function (userId) {
        if(userId){
            sweet.show({
            title: 'Confirm',
            text: 'Delete this User?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            closeOnConfirm: true
            }, function() {
                $http.delete(apibaseurl+'api/user/'+userId)
                .success(function (data) {
                    atomicNotifyService.success(data.message, 3000);
                    $state.go('main.users');
                });
            });
            
        }
    };

    $scope.resetConfirmation = function(){
        $scope.formData.confirm_password = '';
    }
    $scope.init();
});