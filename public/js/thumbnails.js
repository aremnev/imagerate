window.Thumbnails = {
    elements: $('.thumbnails'),
    options: {
        columns: 3
    },
    init: function(){
        var self = this;
        if(self.elements.length) {
            self.elements.masonry({
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
        if(this.elements.length) {
            this.elements.masonry('reload');
        }
    },
    setColumns: function() {
        this.options.columns = $(window).width() > 1200 ? 3 : $( window ).width() > 900 ? 2 : $( window ).width() > 767 ? 1 : $( window ).width() > 320 ? 2 : 1 ;
        this.reload();
    }
}

$(window).on('load', function(){
    Thumbnails.init();
});

$(window).on('resize', function(){
    Thumbnails.setColumns();
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
