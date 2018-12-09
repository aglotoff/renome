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
        });
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
