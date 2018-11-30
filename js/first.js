$(function () {

    var currentPage = 1
    var pageSize = 5

    render()

    function render() {
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            type: 'get',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('firstTmp', info)
                $('tbody').html(htmlStr)

                // 在请求数据回来之后初始化分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a, b, c, page) {
                        currentPage = page
                        render()
                    }
                })
            }
        })
    }


    // 2.点击添加分类按钮，显示木太狂
    $('#addCate').click(function () {
        $('#addModal').modal('show')
    })

    // 3.表单检验
    $('#form').bootstrapValidator({
        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        // 校验字段
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: '请输入一级分类'
                    }
                }
            }
        }
    })

    // 4.注册表单校验成功事件
    $('#form').on('success.form.bv',function (e) {  
        e.preventDefault();
        $.ajax({
            url: '/category/addTopCategory',
            type: 'post',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {      
                console.log(info);
                if(info.success) {
                    $('#addModal').modal('hide')
                    currentPage = 1
                    render()

                    // 重置状态
                    $('#form').data('bootstrapValidator').resetForm(true)
                }
            }
        })
    })


})