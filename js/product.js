$(function () {  

    var currentPage = 1
    var pageSize = 5

    var picArr = []  // 创建一个数组，专门用来存放上传的图片对象

    // 1.渲染页面
    render()

    function render() {  
        $.ajax({
            url: '/product/queryProductDetailList',
            type: 'get',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {  
                console.log(info);
                $('tbody').html( template('proTmp',info) )

                // 初始化分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page,
                    totalPages: Math.ceil(info.total / info.size),
                    onPageClicked: function (a,b,c,page) {  
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

        // 同时渲染下拉框
        $.ajax({
            url: '/category/querySecondCategoryPaging',
            type: 'get',
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: 'json',
            success: function (info) {  
                console.log(info);
                $('.dropdown-menu').html( template('dropdown2',info) )
            }
        })
    })

    // 3.给下拉框按钮注册点击事件
    $('.dropdown-menu').on('click','a',function () { 
        // 获取文本内容
        var txt = $(this).text()
        $('.secondCate').text(txt)

        // 获取id 
        var id = $(this).data('id')
        // 赋值给隐藏域
        $('[name="brandId"]').val(id)

        // 手动清除下拉框的样式
        $('#form').data('bootstrapValidator').updateStatus('brandId','VALID')
    })

    // 4.点击上传图片按钮
    $('#fileupload').fileupload({
        dataType: 'json',
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done: function (e,data) {  
            var picObj = data.result

            // 把每个图片地址都存储到数组中
            picArr.unshift(picObj)

            var picSrc = picObj.picAddr
            // 把上传的图片插入到最前面
            $('#imgBox').prepend('<img src="' + picSrc + '" style="width:100px;">')

            // 如果图片超过三张，删除最后一张
            if(picArr.length > 3) {
                picArr.pop()
                // 表单渲染的最后一张也要删除
                $('#imgBox img:last-of-type').remove()
            }

            // 如果图片超过三张，修改状态
            if(picArr.length == 3) {
                $('#form').data('bootstrapValidator').updateStatus('brandStatus','VALID')
            }
        }
    })

    // 5.注册表单校验事件
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
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择二级分类'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式, 必须是非零开头的数字'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '尺码格式, 必须是 32-40'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    },
                    regexp: {
                        regexp: /^\d*$/,
                        message: '原价必须是数字'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    },
                    regexp: {
                        regexp: /^\d$/,
                        message: '现价必须是数字'
                    }
                }
            },
            brandStatus: {
                validators: {
                    notEmpty: {
                        message: '请输入三张图片'
                    }
                }
            },
        }
    })

    // 6.注册表单校验成功事件
    $('#form').on('success.form.bv',function (e) {  
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            url: '/product/addProduct',
            type: 'post',
            data: $('#form').serialize(),
            dataType: 'json',
            success: function (info) {  
                console.log(info);
                // 关闭模态框
                $('#addModal').modal('hide')
                // 重新渲染第一页
                currentPage = 1
                render()

                // 重置表单状态
                $('#form').data('bootstrapValidator').resetForm(true)
            }
        })
    })

})