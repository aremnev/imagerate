$(document).ready(function () {

    $('.remove').on('click', function(e) {
        var $self = $(this),
           action = $self.data('action');

        $.post(action, function(d) {
            $self.parent().remove();
        });
    });

});
