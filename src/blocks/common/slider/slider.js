/**
 * @file Implementation of the slider block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES -------------------------- 

// Block name
const BLOCK = 'slider';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
    ARROW_NEXT: `.${BLOCK}__arrow_dir_next`,
    ARROW_PREV: `.${BLOCK}__arrow_dir_prev`,
};

// Element class names
const CLASSES = {
    SLIDE_ACTIVE: `${BLOCK}__slide_active`,
};

const AUTOPLAY_SPEED = 5000;
const TRANSITION_SPEED = 500;

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

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
        const $container = $(SELECTORS.CONTAINER, $root);
        const $prevArrow = $(SELECTORS.ARROW_PREV, $root);
        const $nextArrow = $(SELECTORS.ARROW_NEXT, $root);

        $container.slick({
            rows: 0,
            zIndex: 1,

            cssEase: 'linear',
            fade: true,
            speed: TRANSITION_SPEED,

            autoplay: true,
            autoplaySpeed: AUTOPLAY_SPEED,
            pauseOnFocus : false,
            pauseOnHover: false,

            prevArrow: $prevArrow,
            nextArrow: $nextArrow,
        });

        $container.on('beforeChange', this.handleSlickBeforeChange);
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
    handleSlickBeforeChange(e, slick, current, next) {
        slick.$slides.eq(current).removeClass(CLASSES.SLIDE_ACTIVE);
        slick.$slides.eq(next).addClass(CLASSES.SLIDE_ACTIVE);
    }

    // --------------------------- END EVENT HANDLERS -------------------------
}

// --------------------------- END CLASS DEFINITION --------------------------- 

$(SELECTORS.BLOCK).each(function() {
    new Slider($(this));
});

export default Slider;
