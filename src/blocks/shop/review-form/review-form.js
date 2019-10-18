/**
 * @file Implementation of the review form block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'review-form';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    FIELD: '.form__field',
};

// Element class names
const CLASSES = {
    ERROR: 'error form__error',
    INPUT: 'input',
    INPUT_INVALID: 'input_invalid',
    TEXTAREA: 'text-area',
    TEXTAREA_INVALID: 'text-area_invalid',
};

// --------------------------- END MODULE VARIABLES ---------------------------

// ------------------------- BEGIN UTILITY FUNCTIONS --------------------------

/**
 * Given the input element, get a classname containing the invalid modifier
 * 
 * @param {JQuery} $element The input element
 */
function getInvalidClassName($element) {
    if ($element.hasClass(CLASSES.INPUT_INVALID)) {
        return CLASSES.INPUT_INVALID;
    } else if ($element.hasClass(CLASSES.TEXTAREA)) {
        return CLASSES.TEXTAREA_INVALID;
    }
}

// -------------------------- END UTILITY FUNCTIONS ---------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the review form block.
 */
function initBlock() {
    const $form = $(SELECTORS.BLOCK);
    if ($form.length == 0) {
        return;
    }

    $form.validate({
        errorClass: CLASSES.ERROR,
    
        errorPlacement: function($error, $element) {
            $element.closest(SELECTORS.FIELD).append($error);
        },
    
        highlight(element) {
            $(element).addClass(getInvalidClassName($(element)));
        },
    
        unhighlight(element) {
            $(element).removeClass(getInvalidClassName($(element)));
        },
    });
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();