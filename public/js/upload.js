$(document).ready(function () {
    $('#uploadModal').on('shown', function () {
        var form = $('.form-upload'),
            error = form.prev(),
            title = $('#image_title'),
            file_input = $('#image'),
            upload_block = $('.image-upload'),
            progress = form.find('.progress');

        form.on('submit', function(e) {
            e.preventDefault();
        })

        file_input.fileupload({
            dataType: 'json',
            add: function (e, data) {
                form.data('file', data.files[0]);
                upload_block.find('.text').text(data.files[0].name);
                form.find('[type="submit"]').click(function () {
                    if($.trim(title.val())) {
                        data.submit();
                    }
                });
                error.addClass('hidden');
            },
            always: function (e, data) {
                if(!data.jqXHR) return;
                if(data.jqXHR.status == 200){
                    window.location.href = window.location.pathname;
                } else {
                    form.removeClass('process');
                    progress.children().css('width', 0);
                    error.text(data.jqXHR.responseText).removeClass('hidden');
                }
            },
            progress: function (e, data) {
                progress.children().css('width', parseInt(data.loaded / data.total * 100, 10) + '%');
            },
            send: function (e, data) {
                form.addClass('process');
                if(form.data('file') != data.files[0]){
                    return false;
                }
            }
        });
    })
});