/**
 * @file Implementation of the review form block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the review form module.
 * @return true if the block is present, false otherwise
 */
export const initModule = function() {
    const $form = $('.review-form');
    if ($form.length === 0) {
        return false;
    }

    $form.validate({
        errorClass     : 'error review-form__error',
    
        errorPlacement : function(error, element) {
            element.closest('.review-form__field').append(error);
        },
    
        highlight      : function(element) {
            if ($(element).hasClass('input')) {
                $(element).addClass('input_invalid');
            } else if ($(element).hasClass('text-area')) {
                $(element).addClass('text-area_invalid');
            }
        },
    
        unhighlight    : function(element) {
            if ($(element).hasClass('input')) {
                $(element).removeClass('input_invalid');
            } else if ($(element).hasClass('text-area')) {
                $(element).removeClass('text-area_invalid');
            }
        },
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
