/**
 * @file Implementation of the project carousel block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the project carousel block.
 */
export function initBlock() {
    $('.project-carousel__container').slick({
        rows: 0,
        slide: '.project-carousel__slide',

        prevArrow: '.project-carousel__arrow_dir_prev',
        nextArrow: '.project-carousel__arrow_dir_next',
        dots: true,

        cssEase: 'linear',
        speed: 250,
        zIndex: 1,
    });
}

// ---------------------------- END PUBLIC METHODS ----------------------------
