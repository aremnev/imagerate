window.Thumbnails = {
    options: {
        columns: 3
    },
    init: function() {
        var self = this,
            elements = self.getElements();
        if(elements.length) {
            elements.masonry({
                itemSelector : '.item',
                columnWidth:  function(containerWidth) {
                    return containerWidth / self.options.columns;
                },
                isResizable: true,
                isAnimated: true
            });
            self.setColumns();
            self.initScroll();
        }
    },
    reload: function(){
        var elements = this.getElements();
        if(elements && elements.data('masonry')) {
            elements.masonry('reload');
        }
    },
    setColumns: function() {
        this.options.columns = $(window).width() > 1200 ? 3 : $( window ).width() > 900 ? 2 : $( window ).width() > 767 ? 1 : $( window ).width() > 320 ? 2 : 1 ;
        this.reload();
    },
    getElements: function() {
        return $('.thumbnails');
    },
    initScroll: function() {
        var self = this,
            elements = self.getElements(),
            info = elements.data('info');

        if (info) {
            elements.off('pageScroll').on('pageScroll', getItems);
            function getItems(){
                if (elements.hasClass('process')) return;
                elements.addClass('process');
                if ((info.page + 1) * info.perPage < info.count) {
                    var bottom = $(document).scrollTop() + $(window).height();
                    if (elements.position().top + elements.height() <= bottom) {
                        $.get(location.path, {page: info.page + 1}, function(d) {
                            var newEls = $(d).find('.thumbnails');
                            elements.append(newEls.children());
                            info = newEls.data('info');
                            self.reload();
                            elements.removeClass('process');
                            getItems();
                            angular.bootstrap($('.ng-scope'));
                        });
                    }
                }
            }
            getItems();
        }
    }
}

$(window).on('load', function(){
    Thumbnails.init();
});

$(window).on('resize', function(){
    Thumbnails.setColumns();
});

$(window).on('scroll', function() {
    $('.thumbnails').trigger('pageScroll');
});

$(document).ready(function(){
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

    // $(document).on('click', '.edit-title__link', function() {
        // $(this).hide()
            // .siblings('.edit-title')
            // .show()
            // .end()
            // .siblings('.title')
            // .hide();
        // Thumbnails.reload();
    // });

    // $(document).on('click', '.edit-title__submit', function(e) {
        // e.preventDefault();
        // var input = $('.edit-title__input'),
            // form = $(this).parent('.edit-title');
        // form.siblings('.title, .edit-title__link')
            // .show()
            // .end()
            // .hide();
        // Thumbnails.reload();
        // if(!$.trim(input.val())) return;
        // $.post(form.attr('action'), form.serialize(), function(d){
            // if(d){
                // form.siblings('.title').html(d);
            // }
        // });
    // });
})
