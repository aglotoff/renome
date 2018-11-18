$('.contact-form').validate({
    errorClass: 'error contact-form__error',

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
