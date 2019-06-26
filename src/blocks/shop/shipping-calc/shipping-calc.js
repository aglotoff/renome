/**
 * @file Implementation of the shipping calculator block
 * @author Andrey Glotov
 */

import Select from '../../common/select/select';

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
    
    const countrySelect = new Select($country, { theme: 'small' });

    $form.validate({
        errorClass     : 'error shipping-calc__error',

        rules: {
            calc_shipping_country: {
                required: true,
            }
        },

        errorPlacement : function($error, $element) {
            $error.appendTo($element.closest('.shipping-calc__field'));
        },
    
        highlight      : function(element) {
            if ($(element).hasClass('input')) {
                $(element).addClass('input_invalid');
            } else if ($(element).is($country)) {
                countrySelect.setError(true);
            }
        },
    
        unhighlight     : function(element) {
            if ($(element).hasClass('input')) {
                $(element).removeClass('input_invalid');
            } else if ($(element).is($country)) {
                countrySelect.setError(false);
            }
        }
    });

    $country.on('change', () => {
        $form.validate().element('select');
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
