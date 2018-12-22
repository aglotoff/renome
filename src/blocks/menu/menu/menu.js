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

            closeMarkup : '<button aria-label="Close" type="button" '
                + 'class="mfp-close">&#215;</button>',

            callbacks   : {
                beforeOpen() {
                    this.wrap.attr({
                        'role'       : 'dialog',
                        'aria-label' : 'View image',
                    });
                },
            },
        });
    });
    
    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------