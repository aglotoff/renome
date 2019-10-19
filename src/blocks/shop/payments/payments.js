/**
 * @file Implementation of the checkout payments block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'payments';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    RADIO: `.${BLOCK}__radio`,
    DESC: `.${BLOCK}__desc`,
    METHOD: `.${BLOCK}__method`,
};

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the payments block.
 */
function initBlock() {
    const $payments = $(SELECTORS.BLOCK);
    if ($payments.length == 0) {
        return;
    }

    const $radios = $(SELECTORS.RADIO, $payments);
    const $desc   = $(SELECTORS.DESC, $payments);
    $radios.change(function handleRadioChange() {
        $desc.slideUp();

        $(this)
            .closest(SELECTORS.METHOD)
            .find(SELECTORS.DESC)
            .slideDown();
    });
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();