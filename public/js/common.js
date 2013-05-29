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

    $(window).on('resize', function(){
        Thumbnails.setColumns();
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
        autoplayDuration: 3000,
        autoplayPauseOnHover: true
    });

    (function(){
        var wait = $('.wait');
        if(wait.length) {
            var loaded = 0;
            wait.one('load', function(e){
                loaded++;
                if(loaded == wait.length) {
                    //console.log("all loaded");
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

    var Thumbnails = {
        options: {
            columns: 3
        }, 
        init: function(){
            var self = this;

            self.setColumns();

            $('.thumbnails').masonry({
                itemSelector : '.item',
                columnWidth:  function(containerWidth) {
                    return containerWidth / self.options.columns;
                },
                isResizable: true
            });
        },
        reload: function(){
            $('.thumbnails').masonry('reload');
        },
        setColumns: function() {
            this.options.columns = $(window).width() > 767 ? 3 : $( window ).width() > 320 ? 2 : 1;
            this.reload();
            console.log(this.options.columns);
        }
    }
});
