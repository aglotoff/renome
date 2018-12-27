/**
 * @file Implementation of the comment form block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the comment form module.
 * @return true
 */
export const initModule = function() {
    const $page = $('.page');

    const $form    = $('.comment-form');
    const $replyTo = $form.find('[name="reply-to"]');

    $form.validate({
        errorClass  : 'error comment-form__error',
    
        highlight   : function(element) {
            if ($(element).hasClass('input')) {
                $(element).addClass('input_invalid');
            } else if ($(element).hasClass('text-area')) {
                $(element).addClass('text-area_invalid');
            }
        },
    
        unhighlight : function(element) {
            if ($(element).hasClass('input')) {
                $(element).removeClass('input_invalid');
            } else if ($(element).hasClass('text-area')) {
                $(element).removeClass('text-area_invalid');
            }
        },
    });

    $page.on('comment-reply', function(event, id) {      
        $replyTo.val(id);

        $('html, body').animate({
            scrollTop: $form.offset().top - 100
        }, 400, function() {
            $('.input:first', $form).focus();
        });
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
