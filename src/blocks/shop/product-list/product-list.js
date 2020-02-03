/**
 * @file Implementation of the product list block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'product-list';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    PRODUCT: '.product',
};

// Element class names
const CLASSES = {
    PRODUCT_FOCUS: 'product_has-focus',
};

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the product list block.
 */
function initBlock() {
    const $root = $(SELECTORS.BLOCK);
    if ($root.length === 0) {
        return;
    }

    // Until all major browsers support the :focus-within CSS pseudo-class
    // apply a focus class using JavaScript
    $root.on({
        focusin: function handleProductFocusin() {
            $(this).addClass(CLASSES.PRODUCT_FOCUS);
        },
        focusout: function handleProductFocusout() {
            $(this).removeClass(CLASSES.PRODUCT_FOCUS);
        },
    }, SELECTORS.PRODUCT);
}

// ---------------------------- END PUBLIC METHODS ----------------------------

initBlock();
