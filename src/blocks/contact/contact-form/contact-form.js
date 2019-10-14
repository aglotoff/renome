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
            errorClass: 'error form__error',
    
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

    // ------------------------- BEGIN PUBLIC METHODS -------------------------

    /**
     * Initialize all contact form blocks on the page.
     */
    static initAll() {
        $('.contact-form').each(function() {
            new ContactForm($(this));
        });
    }

    // -------------------------- END PUBLIC METHODS --------------------------
}

ContactForm.initAll();

export default ContactForm;