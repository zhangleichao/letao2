$(function () {
    var currentPage = 1
    var pageSize = 5

    render()

    function render() {
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            type: 'get',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('secTmp', info)
                $('tbody').html(htmlStr)

                // 初始化分页
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

    // 2.点击添加分类按钮，显示模态框
    $('#addCate').click(function () {
        $('#addModal').modal('show')

        // 发送ajax请求，动态渲染下拉框
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            type: 'get',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                $('.dropdown-menu').html(template('dropdown1', info))
            }
        })
    })

    // 3.给下拉框的a注册点击事件
    $('.dropdown').on('click', 'a', function () {
        var txt = $(this).text()
        // 赋值给按钮
        $('.firstCate').text(txt)

        // 获取id
        var id = $(this).data('id')
        // 赋值给隐藏域
        $('[name="categoryId"]').val(id)

        // 改变状态
        $('#form').data('bootstrapValidator').updateStatus('categoryId','VALID')
    })

    // 4.图片预览
    $('#fileupload').fileupload({
        dataType: 'json',
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e, data) {
            console.log(data);
            // 获取图片地址
            var picSrc = data.result.picAddr
            // 赋值给图片
            $('#imgBox').attr('src', picSrc)

            // 还赋值给隐藏域
            $('[name="brandLogo"]').val(picSrc)

            // 改变状态
            $('#form').data('bootstrapValidator').updateStatus('brandLogo','VALID')
        }
    })

    // 5.表单校验
    $('#form').bootstrapValidator({
        // 重置排除项, 都校验, 不排除
        excluded: [],

        // 配置校验图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
        },
        // 校验字段
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传图片'
                    }
                }
            },
        }
    })

    // 6.注册检验成功事件
    $('#form').on('success.form.bv',function (e) {  
        e.preventDefault();
        
        // 发送ajax
        $.ajax({
            url: '/category/addSecondCategory',
            type: 'post',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {  
                console.log(info);
                if(info.success) {
                    $('#addModal').modal('hide')
                    render()

                    // 重置状态
                    $('#form').data('bootstrapValidator').resetForm(true)
                }
            }
        })
    })


})