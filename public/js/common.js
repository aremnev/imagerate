String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
}

$(document).ready(function () {
    if (/*@cc_on!@*/false && document.documentMode === 10) {
        $('.modal.fade').removeClass('fade');
    }

    $(document).on('click', '.ajax-delete', function(e){
            e.preventDefault();
            var button = $(this),
                text = button.data('confirm'),
                ok = button.data('ok'),
                url = button.attr('href');
            if (confirm(text)) {
                $.ajax({
                    type: 'delete',
                    url: url
                }).done(function(msg) {
                   if(ok) window.location.href = ok;
                   else window.location.reload();
                });
            }
        });

    (function(){
        var ajax = $('.ajax-add'),
            form = ajax.find('form'),
            list_wrap = ajax.find('.results').parent(),
            input = form.find('input[type="text"]');

        form.on('submit', function(e) {
            e.preventDefault();
            if(!$.trim(input.val())) return;
            $.post(form.attr('action'), form.serialize(), function(d){
                input.val('');
                list_wrap.children('.results').replaceWith($(d).find('.results'));
            });
        });
    }());

    (function(){
        var wait = $('.wait');
        if(wait.length) {
            var loaded = 0;
            wait.one('load', function(e){
                loaded++;
                if(loaded == wait.length) {
                    $('.waiting').removeClass('waiting');
                    Thumbnails.init();
                }
            }).each(function() {
                if(this.complete) $(this).load();
            });
        } else {
            $('.waiting').removeClass('waiting');
        }
        setTimeout(function(){
            $('.waiting').removeClass('waiting');
        }, 10000);
    }());
});















