/**
 * @file Implementation of the contact form block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'contact-form';

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
 * @param {JQuery} $element The input element
 */
function getInvalidClassName($element) {
    if ($element.hasClass(CLASSES.INPUT)) {
        return CLASSES.INPUT_INVALID;
    } else if ($element.hasClass(CLASSES.TEXTAREA)) {
        return CLASSES.TEXTAREA_INVALID;
    }
}

// -------------------------- END UTILITY FUNCTIONS ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * Contact form block implementation
 */
class ContactForm {

    /**
     * Create contact form
     * 
     * @param {JQuery} $root The block root element
     */
    constructor($root) {
        $root.validate({
            errorClass: CLASSES.ERROR,
    
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

}

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all contact form blocks on the page
$(SELECTORS.BLOCK).each(function() {
    new ContactForm($(this));
});

export default ContactForm;
