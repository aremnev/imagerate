$(document).ready(function () {

    $('.remove').on('click', function(e) {
        var $self = $(this),
           action = $self.data('action');

        $.post(action, function(d) {
            $self.parent().remove();
        });
    });

    (function(){
        var form = $('.ajax-add').find('form'),
            list_wrap = $('.ajax-add').find('.results').parent();

        form.on('submit', function(e) {
            e.preventDefault();
            form.attr('action');
            $.post(form.attr('action'), form.serialize(), function(d){
                form.find('input[type="text"]').val('');
                list_wrap.children('.results').replaceWith($(d).find('.results'));
            });
        });
    }());

});
