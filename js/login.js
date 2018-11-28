// 1.表单检验
$(function () {
    $('#form1').bootstrapValidator({


        // 指定检验字段
        fields: {
            username: {
                // 检验用户名，对应表单的name属性
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    // 长度检验
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: '用户名长度必须在2-6位'
                    },
                    // callback 专门用来设置回调的信息
                    callback: {
                        message: '用户名不存在'
                    }
                }
            },
            // 检验密码
            password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: '密码必须在6-12位'
                    },
                    callback: {
                        message: '密码错误'
                    }
                }
            }
        }
    })
})

// 2.阻止默认行为
$(function () {  
    $('#form1').on('success.form.bv',function (e) {  
        e.preventDefault();
        // 使用ajax发送请求
        $.ajax({
            url: '/employee/employeeLogin',
            type: 'post',
            data: $('#form1').serialize(),
            dataType: 'json',
            success: function (info) {  
                // console.log(info);
                if(info.error === 1000) {
                    // alert(info.message)
                    // 跟新当前的input状态，更新成失败
                    $('#form1').data('bootstrapValidator').updateStatus('username','INVALID','callback')
                    return
                }
                if(info.error === 1001) {
                    // alert(info.message)
                    $('#form1').data('bootstrapValidator').updateStatus('password','INVALID','callback')
                }
                if(info.success) {
                    location.href = 'index.html'
                }
            }
        })
    })
})

// 3.重置功能
$('[type="reset"]').on('click',function () {  
    $('#form1').data('bootstrapValidator').resetForm( true )
})