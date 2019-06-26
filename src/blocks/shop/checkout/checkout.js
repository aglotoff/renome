/**
 * @file Implementation of the checkout block
 * @author Andrey Glotov
 */

import Select from '../../common/select/select';

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onCheckboxChange = function() {
    const $target = $('#' + $(this).data('toggle'));
    $target.slideToggle();
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the checkout module.
 * @return true if the block is present; false otherwise
 */
export const initModule = function() {
    const $form = $('.checkout');
    if ($form.length === 0) {
        return false;
    }

    const $selects  = $form.find('.checkout__select');
    $selects.each(function() {
        new Select($(this), { theme: 'checkout' });
    });

    const $shipping = $form.find('#shipping-fields');
    $shipping.hide();

    const $checkboxes = $form.find('.checkout__check-input');
    $checkboxes.change(onCheckboxChange);

    $form.validate({
        errorClass     : 'error checkout__error',
    
        ignore         : '.checkout__input:hidden',
    
        highlight: function(element) {
            if ($(element).hasClass('input')) {
                $(element).addClass('input_invalid');
            }
        },
    
        unhighlight    : function(element) {
            if ($(element).hasClass('input')) {
                $(element).removeClass('input_invalid');
            }
        },
    
        errorPlacement : function(error, element) {
            if (element.attr('name') === 'payment') {
                element
                    .closest('.checkout__payments')
                    .prepend(error);
            } else {
                error.insertAfter(element);
            }
        },
    
        // messages       : {
        //     payment: 'Please select a payment method',
        // },
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
