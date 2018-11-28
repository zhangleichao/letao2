
// 开启进度条
// ajaxStart 所有的 ajax 开始调用
$(document).ajaxStart(function () {  
    NProgress.start()
})

// 当最后一个ajax结束的时候结束
$(document).ajaxStop(function () {  
    setTimeout(function () {  
        NProgress.done()
    },1000)
})


$(function () {  
    // 1.左侧二级目录切换
    $('.category').on('click',function () {  
        $(this).next().stop().slideToggle()
    })

    // 2.左侧导航栏切换
    $('.icon-left').on('click',function () {  
        $('.lt_aside').toggleClass('hidemenu')
        $('.lt_toolbar').toggleClass('hidemenu')
        $('.lt_main').toggleClass('hidemenu')
    })

    // 3.退出登录功能
    $('.icon-right').on('click',function () {  
        $('#logoutModal').modal('show')
    })

    // 点击退出按钮，退出登录
    $('#logout').on('click',function () {  
        // 发送ajax请求
        $.ajax({
            url: '/employee/employeeLogout',
            type: 'get',
            dataType: 'json',
            success: function (info) {  
                // console.log(info);
                if(info.success) {
                    location.href = 'login.html'
                }
            }
        })
    })
})
