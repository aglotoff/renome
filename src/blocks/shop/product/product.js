/**
 * @file Implementation of the product block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const RESPONSE_TIME = 1000;
// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN UTILITY FUNCTIONS -------------------------
const fakeRequest = function() {
    const $d = $.Deferred();

    // Mock a server request
    setTimeout(function() {
        $d.resolve();
    }, RESPONSE_TIME);

    return $d.promise();
};
// --------------------------- END UTILITY FUNCTIONS --------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onAddBtnClick = function() {
    const $loader = $('<span></span>')
        .addClass('loader loader_size_s product__add-loader')
        .insertAfter($(this));

    $(this).remove();

    fakeRequest().then(function onItemAdded() {
        $('<a></a>')
            .attr('href', 'shop-cart.html')
            .addClass('product__cart-link')
            .text('Product added')
            .insertAfter($loader)
            .focus();

        $loader.remove();
    });
};

const onProductFocusin = function() {
    $(this).addClass('product_has-focus');
};

const onProductFocusout = function() {
    $(this).removeClass('product_has-focus');
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the shop filter module.
 * @return true
 */
export const initModule = function() {
    $('.product').each(function() {
        const $product = $(this);
        const $addBtn  = $product.find('.product__add-btn');

        $addBtn.click(onAddBtnClick);

        // Until all major browsers support the :focus-within CSS pseudo-class
        // apply a class using JavaScript
        $product
            .focusin(onProductFocusin)
            .focusout(onProductFocusout);
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
