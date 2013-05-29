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
               else window.location.href = window.location.href;
            });
        }
    });

    (function(){
        var form = $('.ajax-add').find('form'),
            list_wrap = $('.ajax-add').find('.results').parent(),
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

    $('.slides').roundabout({
        autoplay: true,
        autoplayDuration: 3000
    });

    (function(){
        var wait = $('.wait');
        if(wait.length) {
            var loaded = 0;
            wait.one('load', function(e){
                loaded++;
                if(loaded == wait.length) {
                    console.log("all loaded");
                    $('.waiting').removeClass('waiting');

                    // TODO: move to separate func; add columns calculation
                    $('.thumbnails').masonry({
                        // options
                        itemSelector : '.item',
                        columnWidth: 100,
                        isResizable: true
                      });
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
