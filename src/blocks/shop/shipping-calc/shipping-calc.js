/**
 * @file Implementation of the shipping calculator block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the shipping calculator module.
 * @return true if the block is present, false otherwise
 */
export const initModule = function() {
    const $calc = $('.shipping-calc');
    if ($calc.length === 0) {
        return false;
    }

    const $toggle  = $calc.find('.shipping-calc__toggle');
    const $form    = $calc.find('.shipping-calc__form');
    const $country = $calc.find('.shipping-calc__country');

    let formExpanded = false;
    $toggle.click(function onShippingCalcToggle() {
        formExpanded = !formExpanded;

        $form.slideToggle();
        $toggle.attr('aria-expanded', String(formExpanded));
    });
    
    $country
        .select2({
            theme                   : 'renome-alt',
            width                   : 'style',
            minimumResultsForSearch : Infinity,
            placeholder             : 'Select a country',
        })
        .data('select2')
        .$container
        .addClass('shipping-calc__input');
    
    $form.validate({
        errorClass     : 'error shipping-calc__error',
    
        errorPlacement : function(error, element) {
            if (element.hasClass('shipping-calc__country')) {
                error.insertAfter(element.next('.shipping-calc__input'));
            } else {
                error.insertAfter(element);
            }
        },
    
        highlight      : function(element) {
            if ($(element).hasClass('input')) {
                $(element).addClass('input_invalid');
            } else if ($(element).hasClass('shipping-calc__country')) {
                $(element)
                    .next('.shipping-calc__input')
                    .addClass('select2-container--renome-error');
            }
        },
    
        unhighlight     : function(element) {
            if ($(element).hasClass('input')) {
                $(element).removeClass('input_invalid');
            } else if ($(element).hasClass('shipping-calc__country')) {
                $(element)
                    .next('.shipping-calc__input')
                    .removeClass('select2-container--renome-error');
            }
        }
    });
    
    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
