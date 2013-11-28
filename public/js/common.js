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
                   else window.location.reload();
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
	
	$('.contests-list').each( function() {
		if ( $(this).children().length == 0 )
			$(this).prev('h2').hide();
	});
    
    $('.edit-title__link').on('click', function() {
        $(this).hide()
            .siblings('.edit-title')
            .show()
            .end()
            .siblings('.title')
            .hide();
        Thumbnails.reload();    
    }); 
    $('.edit-title__submit').on('click', function(e) {
        e.preventDefault();
        var input = $('.edit-title__input'),
            form = $(this).parent('.edit-title');
        form.siblings('.title, .edit-title__link')
            .show()
            .end()
            .hide();
        Thumbnails.reload();
        if(!$.trim(input.val())) return;
        $.post(form.attr('action'), form.serialize(), function(d){
            if(d){
                form.siblings('.title').html(d); 
            }
        });    
    });

	
	
	
	
	/******************************************************************/
	
	$(function() {
	var doc_w = window.innerWidth;
    if ( doc_w>750 && doc_w<1008 ) {
        var left = {
            imgFront	: -350,
            imgBack		: -300,
            h3			: -270,
            p			: -260,
            a			: -200
        }
        var current = {
            imgFront	: 30,
            imgBack		: 200,
            h3			: 465,
            p			: 465,
            a			: 560
        }
        var right = {
            imgFront	: 745,
            imgBack		: 745,
            h3			: 745,
            p			: 745,
            a			: 745
        }
    }
    else {
        var left = {
            imgFront	: -450,
            imgBack		: -350,
            h3			: -300,
            p			: -275,
            a			: -200
        }
        var current = {
            imgFront	: 30,
            imgBack		: 300,
            h3			: 675,
            p			: 675,
            a			: 700
        }
        var right = {
            imgFront	: 990,
            imgBack		: 990,
            h3			: 990,
            p			: 990,
            a			: 990
        }
    }

	var isScrolling = false;

	$('#carousel').carouFredSel({
		scroll	: {
			duration		: 0,
			timeoutDuration	: 3000
		},
		auto	: false,
		prev	: {
			button		: '#prev',
			conditions	: function() {
				return (!isScrolling);
			},
			onBefore	: function( data ) {
				isScrolling = true;

				$(this).delay(900);

				data.items.old.find('img.img-front')
					.delay(400)
					.animate({
						left: right.imgFront
					});

				data.items.old.find('img.img-back')
					.delay(300)
					.animate({
						left: right.imgBack
					});

				data.items.old.find('h3')
					.delay(200)
					.animate({
						left: right.h3
					});

				data.items.old.find('p')
					.delay(100)
					.animate({
						left: right.p
					});

				data.items.old.find('a')
					.animate({
						left: right.a
					});
			},
			onAfter: function( data ) {
				data.items.old.find('img.img-front')
					.css({
						left: current.imgFront
					});

				data.items.old.find('img.img-back')
					.css({
						left: current.imgBack
					});

				data.items.old.find('h3')
					.animate({
						left: current.h3
					});

				data.items.old.find('p')
					.css({
						left: current.p
					});

				data.items.old.find('a')
					.css({
						left: current.a
					});

				data.items.visible.find('img.img-front')
					.css({
						left: left.imgFront
					}).delay(400)
					.animate({
						left: current.imgFront
					}, function() {
						isScrolling = false;
					});

				data.items.visible.find('img.img-back')
					.css({
						left: left.imgBack
					}).delay(300)
					.animate({
						left: current.imgBack
					});

				data.items.visible.find('h3')
					.css({
						left: left.h3
					}).delay(200)
					.animate({
						left: current.h3
					});

				data.items.visible.find('p')
					.css({
						left: left.p
					}).delay(100)
					.animate({
						left: current.p
					});

				data.items.visible.find('a')
					.css({
						left: left.a
					})
					.animate({
						left: current.a
					});
			}
		},
		next	: {
			button		: '#next',
			conditions	: function() {
				return (!isScrolling);
			},
			onBefore	: function( data ) {
				isScrolling = true;

				$(this).delay(900);	//	delay the onafter

				data.items.old.find('img.img-front')
					.animate({
						left: left.imgFront
					});

				data.items.old.find('img.img-back')
					.delay(100)
					.animate({
						left: left.imgBack
					});

				data.items.old.find('h3')
					.delay(200)
					.animate({
						left: left.h3
					});

				data.items.old.find('p')
					.delay(300)
					.animate({
						left: left.p
					});

				data.items.old.find('a')
					.delay(400)
					.animate({
						left: left.a
					});
			},
			onAfter: function( data ) {
				data.items.old.find('img.img-front')
					.css({
						left: current.imgFront
					});

				data.items.old.find('img.img-back')
					.css({
						left: current.imgBack
					});

				data.items.old.find('h3')
					.animate({
						left: current.h3
					});

				data.items.old.find('p')
					.css({
						left: current.p
					});

				data.items.old.find('a')
					.css({
						left: current.a
					});

				data.items.visible.find('img.img-front')
					.css({
						left: right.imgFront
					})
					.animate({
						left: current.imgFront
					});

				data.items.visible.find('img.img-back')
					.css({
						left: right.imgBack
					}).delay(100)
					.animate({
						left: current.imgBack
					});

				data.items.visible.find('h3')
					.css({
						left: right.h3
					}).delay(200)
					.animate({
						left: current.h3
					});

				data.items.visible.find('p')
					.css({
						left: right.p
					}).delay(300)
					.animate({
						left: current.p
					});

				data.items.visible.find('a')
					.css({
						left: right.a
					}).delay(400)
					.animate({
						left: current.a
					}, function() {
						isScrolling = false;
					});
			}
		}
	});
});
	
	
});















