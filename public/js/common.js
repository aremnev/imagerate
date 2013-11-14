String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
}

window.Thumbnails = {
    options: {
        columns: 3
    }, 
    init: function(){
        var self = this;

        $('.thumbnails').masonry({
            itemSelector : '.item',
            columnWidth:  function(containerWidth) {
                return containerWidth / self.options.columns;
            },
            isResizable: true,
            isAnimated: true
        });

        self.setColumns();
    },
    reload: function(){
        $('.thumbnails').masonry('reload');
    },
    setColumns: function() {
        this.options.columns = $(window).width() > 1200 ? 3 : $( window ).width() > 900 ? 2 : $( window ).width() > 767 ? 1 : $( window ).width() > 320 ? 2 : 1 ;
        this.reload();
    }
}
$(window).on('load', function(){
	Thumbnails.init();
});

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
        autoplayPauseOnHover: true,
        responsive: true
    });

    (function(){
        var wait = $('.wait');
        if(wait.length) {
            var loaded = 0;
            wait.one('load', function(e){
                loaded++;
                if(loaded == wait.length) {
                    $('.waiting').removeClass('waiting');

                    Thumbnails.reload();
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

	$.each($('.thumbnail .more-comments'), function () {
	  $(this).find('li:gt(2)').hide();
	});
	
	$(document).on('click', '.see-all',function(e) {
		e.preventDefault();
        var cur = $(this);
        if (cur.hasClass('hide-link')) {
            $(cur.siblings('li:gt(2)')).hide();
			//$(document).scrollTop(cur.closest('.item').offset().top); //if you want to go back
            cur.text(cur.data('show')).removeClass('hide-link');
        }
        else {
            cur.siblings('li').show();
            cur.text(cur.data('hide')).addClass('hide-link')
        }
		Thumbnails.reload();
    });
	
	$('.my-images').closest('body').addClass('homepage');
	$('.image-large').closest('body').addClass('show-page');
	$('.homepage .link_profile').attr({href:''});
	
	//$('.thumbnails').jscroll();
	
	$('.contests-list').each( function() {
		if ( $(this).children().length == 0 )
			$(this).prev('h2').hide();
	});

});















