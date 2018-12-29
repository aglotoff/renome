/**
 * @file Implementation of the add to cart block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the add to cart module.
 * @return true
 */
export const initModule = function() {
    const $page = $('.page');

    $('.add-to-cart').submit(function onAddToCart() {
        const $qty     = $(this).find('.add-to-cart__qty');
        const quantity = Number($qty.val(), 10);
    
        if (isNaN(quantity) || (~~quantity != quantity) || (quantity < 1)) {
            $qty.focus();
            $page.trigger('error', 'Please enter a valid quantity.');
        } else {   
            $page.trigger('success', {
                message  : '"Korean bibimbap" was successfully added '
                    + 'to your cart.',
                linkText : 'View cart',
                link     : 'shop-cart.html',
            });
        }
    
        return false;
    });    

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
