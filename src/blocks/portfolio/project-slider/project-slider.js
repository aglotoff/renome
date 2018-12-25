/**
 * @file Implementation of the project slider block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the project slider module.
 * @return true;
 */
export const initModule = function() {
    $('.project-slider__container').slick({
        rows      : 0,
        slide     : '.project-slider__slide',

        prevArrow : '.project-slider__arrow_dir_prev',
        nextArrow : '.project-slider__arrow_dir_next',
        dots      : true,

        cssEase   : 'linear',
        speed     : 250,
        zIndex    : 1,
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
