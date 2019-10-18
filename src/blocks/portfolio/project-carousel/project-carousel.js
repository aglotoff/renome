/**
 * @file Implementation of the project carousel block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'project-carousel';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
    SLIDE: `.${BLOCK}__slide`,
    ARROW_PREV: `.${BLOCK}__arrow_dir_prev`,
    ARROW_NEXT: `.${BLOCK}__arrow_dir_next`,
};

// Animation speed
const SLIDE_SPEED = 250;

// --------------------------- END MODULE VARIABLES ---------------------------

// Initialize the project carousel block
$(SELECTORS.CONTAINER).slick({
    rows: 0,
    slide: SELECTORS.SLIDE,

    prevArrow: SELECTORS.ARROW_PREV,
    nextArrow: SELECTORS.ARROW_NEXT,
    dots: true,

    cssEase: 'linear',
    speed: SLIDE_SPEED,
    zIndex: 1,
});
