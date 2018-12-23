/**
 * @file Implementation of the gallery block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the gallery module.
 * @return true;
 */
export const initModule = function() {
    $('.gallery').each(function() {
        $(this).magnificPopup({
            delegate  : '.gallery__thumb-link',
            mainClass : 'lightbox',
            type      : 'image',
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