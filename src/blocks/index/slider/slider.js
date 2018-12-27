/**
 * @file Implementation of the slider block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onSlickBeforeChange = function(event, slick, current, next) {
    // Remove the "active" modifier from the previous slide and apply it to the
    // current one
    slick.$slides.eq(current).removeClass('slider__slide_active');
    slick.$slides.eq(next).addClass('slider__slide_active');
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Initialize the slider module.
 * @return true
 */
export const initModule = function() {
    $('.slider').each(function() {
        const $slider    = $(this);
        const $container = $('.slider__container', $slider);
        const $prevArrow = $('.slider__arrow_dir_prev', $slider);
        const $nextArrow = $('.slider__arrow_dir_next', $slider);

        $container.slick({
            rows          : 0,

            prevArrow     : $prevArrow,
            nextArrow     : $nextArrow,

            autoplay      : true,
            autoplaySpeed : 5000,

            cssEase       : 'linear',
            fade          : true,
            speed         : 500,
            zIndex        : 1,

            pauseOnFocus  : false,
            pauseOnHover  : false,
        });

        $container.on('beforeChange', onSlickBeforeChange);
    });
};
// ----------------------------- END PUBLIC METHODS ---------------------------