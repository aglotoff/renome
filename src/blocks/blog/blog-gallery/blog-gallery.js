/**
 * @file Implementation of the blog gallery block
 * @author Andrey Glotov
 */

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Initialize the blog gallery module.
 * @return true
 */
export const initModule = function() {
    $('.blog-gallery__container').slick({
        rows       : 0,
        slide      : '.blog-gallery__slide',

        prevArrow  : '.blog-gallery__arrow_dir_prev',
        nextArrow  : '.blog-gallery__arrow_dir_next',
        dots       : false,

        speed      : 250,
        cssEase    : 'linear',
        zIndex     : 1,

        responsive : [{
            breakpoint : 970,
            settings   : {
                dots : true
            }
        }]
    });
};
// ----------------------------- END PUBLIC METHODS ---------------------------