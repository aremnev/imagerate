$(document).ready(function () {
    var form = $('.form-upload'),
        title = $('#image_title'),
        file_input = $('#image'),
        upload_block = $('.image-upload');

    form.on('submit', function(e) {
        e.preventDefault();
    })

    file_input.fileupload({
        dataType: 'json',
        add: function (e, data) {
            form.data('file', data.files[0]);
            upload_block.find('span').text(data.files[0].name);
            form.find('[type="submit"]').click(function () {
                if($.trim(title.val())) {
                    data.submit();
                }
            });
        },
        stop: function (e, data) {
            window.location.href = window.location.pathname;
        },
        send: function (e, data) {
           if(form.data('file') != data.files[0]){
               return false;
           }
        }
    });
});