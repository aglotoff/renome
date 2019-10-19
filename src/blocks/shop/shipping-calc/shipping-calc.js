/**
 * @file Implementation of the shipping calculator block
 * @author Andrey Glotov
 */

import Select from '../../common/select/select';

import { forceReflow } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'shipping-calc';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    TOGGLE: `.${BLOCK}__toggle`,
    FORM: `.${BLOCK}__form`,
    COUNTRY: `.${BLOCK}__country`,
    FIELD: `.${BLOCK}__field`,
};

// Element class names
const CLASSES = {
    FORM_ANIMATED: `${BLOCK}__form_animated`,
    FORM_EXPANDED: `${BLOCK}__form_expanded`,
    ERROR: `error ${BLOCK}__error`,
    INPUT: 'input',
    INPUT_INVALID: 'input_invalid',
};

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the shipping calculator block.
 */
function initBlock() {
    const $calc = $(SELECTORS.BLOCK);
    if ($calc.length == 0) {
        return;
    }

    const $toggle = $(SELECTORS.TOGGLE, $calc);
    const $form = $(SELECTORS.FORM, $calc);
    const $country = $(SELECTORS.COUNTRY, $calc);

    let formExpanded = false;
    $toggle.click(function handleShippingCalcToggle() {
        formExpanded = !formExpanded;

        if (!formExpanded) {
            $form.addClass(CLASSES.FORM_ANIMATED);

            const startHeight = $form.innerHeight();
            $form.css('height', startHeight);
            forceReflow($form);
            $form.css('height', 0);

            setTimeout(() => {
                $form
                    .css('height', '')
                    .removeClass(CLASSES.FORM_ANIMATED)
                    .removeClass(CLASSES.FORM_EXPANDED);
            }, 250);
        } else {
            $form
                .addClass(CLASSES.FORM_ANIMATED)
                .addClass(CLASSES.FORM_EXPANDED);
            
            const targetHeight = $form.innerHeight();
            $form.css('height', 0);
            forceReflow($form);
            $form.css('height', targetHeight);

            setTimeout(() => {
                $form
                    .css('height', '')
                    .removeClass(CLASSES.FORM_ANIMATED);
            }, 250);
        }

        $toggle.attr('aria-expanded', String(formExpanded));
    });
    
    const countrySelect = new Select($country, { theme: 'small' });

    $form.validate({
        errorClass: CLASSES.ERROR,

        rules: {
            calc_shipping_country: {
                required: true,
            }
        },

        errorPlacement($error, $element) {
            $error.appendTo($element.closest(SELECTORS.FIELD));
        },
    
        highlight(element) {
            if ($(element).hasClass(CLASSES.INPUT)) {
                $(element).addClass(CLASSES.INPUT_INVALID);
            } else if ($(element).is($country)) {
                countrySelect.setError(true);
            }
        },
    
        unhighlight(element) {
            if ($(element).hasClass(CLASSES.INPUT)) {
                $(element).removeClass(CLASSES.INPUT_INVALID);
            } else if ($(element).is($country)) {
                countrySelect.setError(false);
            }
        }
    });

    $country.on('change', function handleCountryChange() {
        $form.validate().element('select');
    });
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();
