function objectifyForm(formArray) {//serialize data function

    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[ formArray[ i ][ 'name' ] ] = formArray[ i ][ 'value' ];
    }
    return returnArray;
}

function post(url, data, success, error) {
    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        timeout: 600000,
        success: function (response) {
            console.log("response", response);
            success(response);
        },
        error: function (err, textStatus, errorThrown) {
            console.log("err", {err, textStatus, errorThrown});
            if (error) error(err);
        }
    })
}

(function ($) {
    "use strict";

    
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    

})(jQuery);

const swalWithBootstrapButtons = swal.mixin({
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger',
    buttonsStyling: false,
})
$('#login').on("submit", function () {
    let data = objectifyForm($(this).serializeArray());
    post(`/login`, data, function (res) {
        if (res.error) {
            swalWithBootstrapButtons(
                'Đăng nhập thất bại!',
                `${res.message}`,
                'error'
            )
        } else {
            switch (res.data.userType) {
                case 0:
                    window.location.replace("/admin");
                    break; 
            }
        }
    });
    return false;
})