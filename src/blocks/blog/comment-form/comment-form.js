const SCROLL_SPEED = 400;

$('.comment-form').validate({
    errorClass: 'error comment-form__error',

    highlight: function(element) {
        if ($(element).hasClass('input')) {
            $(element).addClass('input_invalid');
        } else if ($(element).hasClass('text-area')) {
            $(element).addClass('text-area_invalid');
        }
    },

    unhighlight: function(element) {
        if ($(element).hasClass('input')) {
            $(element).removeClass('input_invalid');
        } else if ($(element).hasClass('text-area')) {
            $(element).removeClass('text-area_invalid');
        }
    },
});

$('.page').on('commentReply', function(event, id) {
    const $form = $('.comment-form');
    
    $('[name="reply-to"]', $form).val(id);

    $('html, body').animate({
        scrollTop: $form.offset().top - 100
    }, SCROLL_SPEED, function() {
        $('.input:first', $form).focus();
    });
});
