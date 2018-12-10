/**
 * @file Implementation of the menu block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the menu module.
 * @return true
 */
export const initModule = function() {
    $('.menu').each(function() {
        $(this).magnificPopup({
            delegate  : '.menu-product__link',
            mainClass : 'lightbox',
            type      : 'image',
        });
    });
    
    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------