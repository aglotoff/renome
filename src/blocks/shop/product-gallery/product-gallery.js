/**
 * @file Implementation of the product gallery block
 * @author Andrey Glotov
 */

import { getEmSize } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const BLOCK = 'product-gallery';

const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
    NAV: `.${BLOCK}__nav`,
    SLIDE: `.${BLOCK}__slide`,
    THUMB: `.${BLOCK}__thumb`,
    PAGE: '.page',
};

const SLIDE_SPEED = 400;        // Sliding speed (in ms)
const MOBILE_BREAKPOINT = 30;   // Max mobile screen size (in ems)
const TABLET_BREAKPOINT = 48;   // Max tablet screen size (in ems)
const LAPTOP_BREAKPOINT = 62;   // Max laptop screen size (in ems)

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the product gallery block.
 */
function initBlock() {
    const $gallery = $(SELECTORS.BLOCK);
    if ($gallery.length == 0) { 
        return;
    }

    const pageEmSize = getEmSize($(SELECTORS.PAGE));

    const $container = $(SELECTORS.CONTAINER, $gallery);
    const $nav = $(SELECTORS.NAV, $gallery);

    // Initialize the main photo slider 
    $container.slick({
        rows: 0,
        slide: SELECTORS.SLIDE,

        arrows: false,
        dots: false,

        fade: true,
        speed: SLIDE_SPEED,
        zIndex: 1,

        responsive: [{
            breakpoint: MOBILE_BREAKPOINT * pageEmSize,
            settings: {
                dots: true
            }
        }],

        asNavFor: $nav,
    });

    // Initialize the thumb slider
    $nav.slick({
        rows: 0,
        slide: SELECTORS.THUMB,

        focusOnSelect: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,

        zIndex: 1,

        arrows: false,
        dots: false,

        responsive: [{
            breakpoint: LAPTOP_BREAKPOINT * pageEmSize,
            settings: {
                slidesToShow: 3,
            }
        }, {
            breakpoint: TABLET_BREAKPOINT * pageEmSize,
            settings: {
                slidesToShow: 4,
            }
        }, {
            breakpoint: MOBILE_BREAKPOINT * pageEmSize,
            settings: {
                slidesToShow: 3,
            }
        }],

        asNavFor: $container,
    });
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();
