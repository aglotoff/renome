/**
 * @file Implementation of the checkout page block
 * @author Andrey Glotov
 */

import Select from '../../common/select/select';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'checkout';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    SELECT: `.${BLOCK}__select`,
    CHECKBOX: `.${BLOCK}__checkbox`,
    INPUT_HIDDEN: '.form__input:hidden',
    PAYMENTS: `.${BLOCK}__payments`,
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

// --------------------------- BEGIN EVENT HANDLERS ---------------------------

/**
 * Handle change events on checkboxes.
 * Toggle the corresponding form section.
 */
const handleCheckboxChange = function() {
    const $target = $('#' + $(this).data('toggle'));
    $target.slideToggle();
};

// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the checkout block.
 */
function initBlock() {
    const $form = $(SELECTORS.BLOCK);
    if ($form.length == 0) {
        return;
    }

    $(SELECTORS.SELECT, $form).each(function() {
        new Select($(this), { theme: 'checkout' });
    });

    $('#shipping-fields', $form).hide();

    $(SELECTORS.CHECKBOX, $form).change(handleCheckboxChange);

    $form.validate({
        errorClass: CLASSES.ERROR,
        ignore: SELECTORS.INPUT_HIDDEN,
    
        highlight(element) {
            $(element).addClass(getInvalidClassName($(element)));
        },
    
        unhighlight(element) {
            $(element).removeClass(getInvalidClassName($(element)));
        },
    
        errorPlacement($error, $element) {
            if ($element.attr('name') === 'payment') {
                $element
                    .closest(SELECTORS.PAYMENTS)
                    .prepend($error);
            } else {
                $error.insertAfter($element);
            }
        },
    
        messages: {
            payment: 'Please select a payment method',
        },
    });
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();