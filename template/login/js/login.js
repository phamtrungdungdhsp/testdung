myApp = angular.module('login',[]);

myApp.controller('signin', ['$http', '$scope', ($http,$scope) =>{
    $scope.emailValid = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    $scope.passwordValid = /[a-zA-Z0-9^ ]/;
    
    $scope.signin = (data) =>{
        if(!data.email|| !data.password){
            swal({
                type: 'error',
                title: 'Oops...',
                text: 'Vui lòng điền đầy đủ thông tin!',
            })
        }else if($scope.emailValid.test(data.email)=== false)
        {
            swal({
                type: 'error',
                title: 'Oops...',
                text: 'Vui lòng điền đúng định dạng email',
            })
        }else if($scope.passwordValid.test(data.password)=== false){
            swal({
                type: 'error',
                title: 'Oops...',
                text: 'Mật khảu không được chứa các ký tự đặc biệt',
            })
        }
        else{        
            $http({
            method: "POST",
            url: '/login',
            data: data
        }).then(function successCallback(response){
           switch(response.data){
               case 'success':
               swal({
                type: 'success',
                title: 'Congratulation',
                text: 'Đăng nhập thành công!',
                showConfirmButton: false,
                timer: 1000
               }).then(function(){
                window.location = '/dashboard';
               });
               
               break;
               case 'ban':
               swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Tài khoản của bạn đã bị khóa!',
                })
                break;
                case 'unactive':
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Tài khoản của bạn chưa được kích hoạt!',
                })
                break;
                case 'wrongemail':
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Tài khoản không tồn tại!',
                })
                break;
                case 'wrongpass':
                swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Mật khẩu nhập không đúng!',
                })
                break;
                default:
                alert('default');

           }
        })}

    }
}])