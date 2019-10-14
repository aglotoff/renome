/**
 * @file Implementation of the shipping calculator block
 * @author Andrey Glotov
 */

import Select from '../../common/select/select';

import { forceReflow } from '../../../js/util/index';

const $calc = $('.shipping-calc');
if ($calc.length !== 0) {
    const $toggle = $('.shipping-calc__toggle', $calc);
    const $form = $('.shipping-calc__form', $calc);
    const $country = $('.shipping-calc__country', $calc);

    let formExpanded = false;
    $toggle.click(function handleShippingCalcToggle() {
        formExpanded = !formExpanded;

        if (!formExpanded) {
            $form.addClass('shipping-calc__form_animated');

            const startHeight = $form.innerHeight();
            $form.css('height', startHeight);
            forceReflow($form);
            $form.css('height', 0);

            setTimeout(() => {
                $form
                    .css('height', '')
                    .removeClass('shipping-calc__form_animated')
                    .removeClass('shipping-calc__form_expanded');
            }, 250);
        } else {
            $form
                .addClass('shipping-calc__form_expanded')
                .addClass('shipping-calc__form_animated');
            
            const targetHeight = $form.innerHeight();
            $form.css('height', 0);
            forceReflow($form);
            $form.css('height', targetHeight);

            setTimeout(() => {
                $form
                    .css('height', '')
                    .removeClass('shipping-calc__form_animated');
            }, 250);
        }

        $toggle.attr('aria-expanded', String(formExpanded));
    });
    
    const countrySelect = new Select($country, { theme: 'small' });

    $form.validate({
        errorClass: 'error shipping-calc__error',

        rules: {
            calc_shipping_country: {
                required: true,
            }
        },

        errorPlacement($error, $element) {
            $error.appendTo($element.closest('.shipping-calc__field'));
        },
    
        highlight(element) {
            if ($(element).hasClass('input')) {
                $(element).addClass('input_invalid');
            } else if ($(element).is($country)) {
                countrySelect.setError(true);
            }
        },
    
        unhighlight(element) {
            if ($(element).hasClass('input')) {
                $(element).removeClass('input_invalid');
            } else if ($(element).is($country)) {
                countrySelect.setError(false);
            }
        }
    });

    $country.on('change', function handleCountryChange() {
        $form.validate().element('select');
    });
}
