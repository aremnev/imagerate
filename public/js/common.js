String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
}

$(document).ready(function () {

    $('.remove').on('click', function(e) {
        var $self = $(this);
        $.ajax({
            url: $self.data('action'),
            type: 'delete',
            success: function(d) {
                $self.parent().remove();
            }
        });
        return false;
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

});
