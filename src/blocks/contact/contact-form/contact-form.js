/**
 * @file Implementation of the contact form block
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
 * Initialize the contact form block.
 * @param {JQuery} $root The block root element
 */
export function initBlock($root) {
    $root.validate({
        errorClass: 'error contact-form__error',

        highlight(element) {
            $(element).addClass(function() {
                return getInvalidClassName($(this));
            });
        },

        unhighlight(element) {
            $(element).removeClass(function() {
                return getInvalidClassName($(this));
            });
        }
    });
}

/**
 * Initialize all contact form blocks on the page.
 */
export function initAll() {
    $('.contact-form').each(function() {
        initBlock($(this));
    });
}

// ---------------------------- END PUBLIC METHODS ----------------------------
