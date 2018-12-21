/**
 * @file Implementation of the about page gallery block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the specials carousel module.
 * @return true
 */
export const initModule = function() {
    $('.about-gallery').each(function() {
        $(this).magnificPopup({
            delegate  : '.about-gallery__thumb',
            mainClass : 'lightbox',
            gallery   : {
                enabled  : true,
                tCounter : '',
            },

            closeMarkup : '<button aria-label="Close" type="button" '
                + 'class="mfp-close">&#215;</button>',
            arrowMarkup : '<button aria-label="%title%" type="button" '
                + 'class="mfp-arrow mfp-arrow-%dir%"></button>',

            callbacks   : {
                beforeOpen() {
                    this.wrap.attr({
                        'role'       : 'dialog',
                        'aria-label' : 'Gallery',
                    });
                },
            },
        });
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
