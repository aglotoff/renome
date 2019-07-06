/**
 * @file Implementation of the review form block
 * @author Andrey Glotov
 */

// ------------------------- BEGIN UTILITY FUNCTIONS --------------------------

/**
 * Given the input element, get a classname containing the invalid modifier
 * @param {JQuery} $element The input element
 */
function getInvalidClassName($element) {
    if ($element.hasClass('input')) {
        return 'input_invalid';
    } else if ($element.hasClass('text-area')) {
        return 'text-area_invalid';
    }
}

// -------------------------- END UTILITY FUNCTIONS ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the review form block.
 */
export function initBlock() {
    const $form = $('.review-form');
    if ($form.length === 0) {
        return false;
    }

    $form.validate({
        errorClass: 'error review-form__error',
    
        errorPlacement: function($error, $element) {
            $element.closest('.review-form__field').append($error);
        },
    
        highlight(element) {
            $(element).addClass(getInvalidClassName($(element)));
        },
    
        unhighlight(element) {
            $(element).removeClass(getInvalidClassName($(element)));
        },
    });
}

// ---------------------------- END PUBLIC METHODS ----------------------------
