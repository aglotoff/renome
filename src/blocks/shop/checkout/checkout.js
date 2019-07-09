/**
 * @file Implementation of the checkout page block
 * @author Andrey Glotov
 */

import Select from '../../common/select/select';

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

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the checkout block.
 */
export function initBlock() {
    const $form = $('.checkout');
    if ($form.length === 0) {
        return false;
    }

    $('.checkout__select', $form).each(function() {
        new Select($(this), { theme: 'checkout' });
    });

    $('#shipping-fields', $form).hide();

    $('.checkout__checkbox', $form).change(handleCheckboxChange);

    $form.validate({
        errorClass: 'error form__error',
        ignore: '.form__input:hidden',
    
        highlight(element) {
            $(element).addClass(getInvalidClassName($(element)));
        },
    
        unhighlight(element) {
            $(element).removeClass(getInvalidClassName($(element)));
        },
    
        errorPlacement($error, $element) {
            if ($element.attr('name') === 'payment') {
                $element
                    .closest('.checkout__payments')
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

// ---------------------------- END PUBLIC METHODS ----------------------------
