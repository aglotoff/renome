/**
 * @file Implementation of the post gallery block
 * @author Andrey Glotov
 */

import { getEmSize } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'post-gallery';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
    SLIDE: `.${BLOCK}__slide`,
    ARROW_PREV: `.${BLOCK}__arrow_dir_prev`,
    ARROW_NEXT: `.${BLOCK}__arrow_dir_next`,
};

const DESKTOP_BREAKPOINT = 62;  // Desktop screen breakpoint (in ems)
const SLIDING_SPEED = 250;      // Slide switch speed (in ms)

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * In-post image gallery
 */
class PostGallery {

    /**
     * Initialize the blog gallery block
     * 
     * @param {JQuery} $root The root block element
     */
    constructor($root) {
        const pageEmSize = getEmSize($('.page'));

        $(SELECTORS.CONTAINER, $root).slick({
            rows: 0,
            slide: SELECTORS.SLIDE,

            prevArrow: SELECTORS.ARROW_PREV,
            nextArrow: SELECTORS.ARROW_NEXT,
            dots: false,

            speed: SLIDING_SPEED,
            cssEase: 'linear',
            zIndex: 1,

            responsive: [{
                breakpoint: DESKTOP_BREAKPOINT * pageEmSize,
                settings: {
                    dots: true
                },
            }],
        });
    }

}

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all carousel blocks on the page
$(SELECTORS.BLOCK).each(function() {
    new PostGallery($(this));
});

export default PostGallery;
