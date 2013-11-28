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
        }
        self.setColumns();
    },
    reload: function(){
        var elements = this.getElements();
        if(elements && elements.length) {
            elements.masonry('reload');
        }
    },
    setColumns: function() {
        this.options.columns = $(window).width() > 1200 ? 3 : $( window ).width() > 900 ? 2 : $( window ).width() > 767 ? 1 : $( window ).width() > 320 ? 2 : 1 ;
        this.reload();
    },
    getElements: function() {
        return $('.thumbnails');
    }
}

$(window).on('load', function(){
    Thumbnails.init();
});

$(window).on('resize', function(){
    Thumbnails.setColumns();
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

    $.each($('.thumbnail .more-comments'), function () {
        $(this).find('li:gt(2)').hide();
    });
})
