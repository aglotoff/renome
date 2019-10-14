/**
 * @file Implementation of the slider block
 * @author Andrey Glotov
 */

// ----------------------------- BEGIN CONSTANTS ------------------------------
const AUTOPLAY_SPEED = 5000;
const TRANSITION_SPEED = 500;
// ------------------------------ END CONSTANTS -------------------------------

/**
 * Slider implementation
 */
class Slider {

    /**
     * Construct a slider
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        const $container = $('.slider__container', $root);
        const $prevArrow = $('.slider__arrow_dir_prev', $root);
        const $nextArrow = $('.slider__arrow_dir_next', $root);

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

        $container.on('beforeChange', this._handleSlickBeforeChange);
    }

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    /**
     * Remove the "active" modifier from the previous slide and apply it to the
     * current one
     * @param {Object} e The event
     * @param {Object} slick Slider instance
     * @param {number} current Current slide index
     * @param {number} next Next slide index
     */
    _handleSlickBeforeChange(e, slick, current, next) {
        slick.$slides.eq(current).removeClass('slider__slide_active');
        slick.$slides.eq(next).addClass('slider__slide_active');
    }

    // --------------------------- END EVENT HANDLERS -------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Initialize all slider blocks on the page.
     */
    static  initAll() {
        $('.slider').each(function() {
            new Slider($(this));
        });
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

Slider.initAll();

export default Slider;
