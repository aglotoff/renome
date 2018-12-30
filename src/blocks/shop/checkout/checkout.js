/**
 * @file Implementation of the checkout block
 * @author Andrey Glotov
 */

// ----------------------------- BEGIN DOM METHODS ----------------------------
const initSelect = function() {
    $(this)
        .select2({
            theme                   : 'theme--checkout',
            width                   : 'style',
            minimumResultsForSearch : Infinity,
        })
        .data('select2')
        .$container
        .addClass('checkout__input');
};
// ------------------------------ END DOM METHODS -----------------------------

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
    $selects.each(initSelect);

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

// $('.checkout__toggle-input').change(function() {
//     $('#' + $(this).data('target-id')).slideToggle();
// });

// $('.checkout__payment-item').click(function() {
//     $('.checkout__payment-radio', $(this))
//         .prop('checked', true)
//         .change();
// });

// $('.checkout__payment-radio').change(function() {
//     $(this)
//         .closest('.checkout__payments')
//         .find('.checkout__payment-item')
//         .each(function() {
//             const isChecked = $('.checkout__payment-radio', $(this))
//                 .prop('checked');
            
//             if (isChecked) {
//                 $('.checkout__payment-desc', $(this))
//                     .slideDown();
//             } else {
//                 $('.checkout__payment-desc', $(this))
//                     .slideUp();
//             }
//         });
// });
