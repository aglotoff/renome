/**
 * @file Implementation of the comment form block
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
 * Initialize the comment form block.
 */
export function initBlock() {
    $('.comment-form').validate({
        errorClass: 'error form__error',
    
        highlight(element) {
            $(element).addClass(getInvalidClassName($(element)));
        },
    
        unhighlight(element) {
            $(element).removeClass(getInvalidClassName($(element)));
        },
    });
}

// ---------------------------- END PUBLIC METHODS ----------------------------
