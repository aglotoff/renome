/**
 * @file Implementation of the slider block
 * @author Andrey Glotov
 */

// ----------------------------- BEGIN CONSTANTS ------------------------------
const AUTOPLAY_SPEED = 5000;
const TRANSITION_SPEED = 500;
// ------------------------------ END CONSTANTS -------------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------

/**
 * Remove the "active" modifier from the previous slide and apply it to the
 * current one
 * @param {Object} e The event
 * @param {Object} slick Slider instance
 * @param {number} current Current slide index
 * @param {number} next Next slide index
 */
function handleSlickBeforeChange(e, slick, current, next) {
    slick.$slides.eq(current).removeClass('slider__slide_active');
    slick.$slides.eq(next).addClass('slider__slide_active');
}

// ---------------------------- END EVENT HANDLERS ----------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------

/**
 * Initialize the slider block.
 * @return true
 */
function initBlock($slider) {
    const $container = $('.slider__container', $slider);
    const $prevArrow = $('.slider__arrow_dir_prev', $slider);
    const $nextArrow = $('.slider__arrow_dir_next', $slider);

    $container.slick({
        rows: 0,
        zIndex: 1,

        cssEase: 'linear',
        fade: true,
        speed: TRANSITION_SPEED,

        autoplay: true,
        autoplaySpeed: AUTOPLAY_SPEED,
        pauseOnFocus  : false,
        pauseOnHover  : false,

        prevArrow: $prevArrow,
        nextArrow: $nextArrow,
    });

    $container.on('beforeChange', handleSlickBeforeChange);
}

/**
 * Initialize all slider blocks on the page.
 */
function initAll() {
    $('.slider').each(function() {
        initBlock($(this));
    });
}

// ----------------------------- END PUBLIC METHODS ---------------------------

export default {
    initAll,
    initBlock,
};
