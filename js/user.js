$(function () {

    var currentPage = 1
    var pageSize = 5

    var id
    var isDelete

    render()

    function render() {
        $.ajax({
            url: '/user/queryUser',
            type: 'get',
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                var htmlStr = template('tmp', info)
                $('.lt_main tbody').html(htmlStr)

                // 根据返回的数据分页
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion: 3,
                    currentPage: info.page, //当前页
                    totalPages: Math.ceil(info.total / info.size), //总页数
                    onPageClicked:function(event, originalEvent, type, page){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page
                        render()
                      }
                })
            }
        })
    }




    // 启用禁用功能
    $('.lt_main tbody').on('click', '.btn', function () {
        $('#toggleModal').modal('show')
        // 获取当前id
        id = $(this).parent().attr('data-id')
        // isDelete = $(this).parent().attr('data-isDelete')
        isDelete = $(this).hasClass('btn-danger') ? 0 : 1
        console.log(id,isDelete);      
    })

    // 点击禁用启用按钮
    $('#confirm').on('click', function () {
        $.ajax({
            url: '/user/updateUser',
            type: 'post',
            data: {
                id: id,
                isDelete: isDelete
            },
            dataType: 'json',
            success: function (info) {
                console.log(info);
                if (info.success) {
                    // 关闭模态框
                    $('#toggleModal').modal('hide')
                    // 重新渲染
                    render()
                }
            }
        })
    })

})