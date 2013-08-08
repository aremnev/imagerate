$(document).ready(function () {
    $('#uploadModal').on('shown', function () {
        var form = $('.form-upload'),
            error = form.find('.alert'),
            title = $('#image_title'),
            file_input = $('#image'),
            upload_block = $('.image-upload'),
            progress = form.find('.progress');

        var type = $('.type', form);

        type.children('input').change(function(e) {
            if($(this).is(':checked')) {
                var el = $('#' + $(this).data('ref'));
                $('.type-ref').addClass('hidden');
                el.removeClass('hidden');
                if(el.attr('id') == 'type-upload') {
                    form.off('submit').on('submit', function(e) {
                        e.preventDefault();
                    })
                } else {
                    form
                        .off('submit')
                        .on('submit', function(e) {
                        e.preventDefault();
                        if($.trim(title.val()) && $.trim(el.find('input').val())) {
                            form.addClass('process');
                            error.addClass('hidden');
                            progress.children().css('width', '100%');
                            $.post(form.attr('action'),form.serialize(), function(d){
                                window.location.href = window.location.pathname;
                            }).error(function(d){
                                progress.children().css('width', 0);
                                form.removeClass('process');
                                error.text(d.responseText).removeClass('hidden');
                            });
                        } else {
                            error.text('Image url required').removeClass('hidden');
                        }
                    });
                }
            }
        });

        type.children('input').change();

        $('#image_title').keyup(function(){

        });

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