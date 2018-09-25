var myApp = angular.module('dashboard', []);

myApp.controller('main', ['$http', '$scope', ($http, $scope) =>{
    $scope.info = data.userLogin;
    $scope.cond = true;
    $scope.updateUsername = () =>{
        $scope.cond = false;
    }
    $scope.saveUsername = (username) =>{
        $http({
            method: "POST",
            url: '/editusername/'+$scope.info._id,
            data: {username: username}
        }).then(function successCallback (response){
            $scope.info.username = response.data.username;
            $scope.cond = true;
            swal({
                position: 'center',
                type: 'success',
                title: 'Thay đổi thành công!',
                showConfirmButton: false,
                timer: 1500
              })
              
        });
    }
    $scope.savePassword = (data) =>{
        $http({
            method: "POST",
            url: '/updatepassword/'+$scope.info._id,
            data: data
        }).then(function successCallback(response){
            switch(response.data.msg){
                case 'oldpwnm':
                swal({
                    position: 'center',
                    type: 'error',
                    title: 'Mật khẩu cũ không đúng!',
                    showConfirmButton: true
                  });
                  break;
                  case 'newpwnm':
                  swal({
                    position: 'center',
                    type: 'error',
                    title: 'Mật khẩu không khớp!',
                    showConfirmButton: true,
                  });
                  break;
                  case 'success':
                  $scope.newpass = null;
                  swal({
                    position: 'center',
                    type: 'success',
                    title: 'Thay đổi thành công!',
                    showConfirmButton: false,
                    timer: 1500
                  });
                  break;
                  default:
                  location.reload();
            }
        });
    }
}]);