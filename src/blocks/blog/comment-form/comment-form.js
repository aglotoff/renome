/**
 * @file Implementation of the comment form block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'comment-form';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
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
 * @param {JQuery} $element The input element to be highlighted as invalid
 */
function getInvalidClassName($element) {
    if ($element.hasClass(CLASSES.INPUT)) {
        return CLASSES.INPUT_INVALID;
    } else if ($element.hasClass(CLASSES.TEXTAREA)) {
        return CLASSES.TEXTAREA_INVALID;
    }
}

// -------------------------- END UTILITY FUNCTIONS ---------------------------

$(SELECTORS.BLOCK).validate({
    errorClass: CLASSES.ERROR,

    highlight(element) {
        $(element).addClass(getInvalidClassName($(element)));
    },

    unhighlight(element) {
        $(element).removeClass(getInvalidClassName($(element)));
    },
});
