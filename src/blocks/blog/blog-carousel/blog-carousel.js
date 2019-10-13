/**
 * @file Implementation of the blog gallery block
 * @author Andrey Glotov
 */

import { getEmSize } from '../../../js/util/index';

// ------------------------------ BEGIN CONSTANTS -----------------------------

const BLOCK = 'blog-carousel';

const Selectors = {
    ROOT: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
    SLIDE: `.${BLOCK}__slide`,
    ARROW_PREV: `.${BLOCK}__arrow_dir_prev`,
    ARROW_NEXT: `.${BLOCK}__arrow_dir_next`,
};

// ------------------------------- END CONSTANTS ------------------------------

/**
 * Blog Post Carousel
 */
class BlogCarousel {

    /**
     * Initialize a carousel
     * 
     * @param {JQuery} $root The root block element
     */
    constructor($root) {
        const pageEmSize = getEmSize($('.page'));

        $(Selectors.CONTAINER, $root).slick({
            rows: 0,
            slide: Selectors.SLIDE,

            prevArrow: Selectors.ARROW_PREV,
            nextArrow: Selectors.ARROW_NEXT,
            dots: false,

            speed: 250,
            cssEase: 'linear',
            zIndex: 1,

            responsive: [{
                breakpoint: 62 * pageEmSize,
                settings: {
                    dots: true
                },
            }],
        });
    }

    // ------------------------- BEGIN PUBLIC METHODS -------------------------

    /**
     * Initialize all carousel blocks on the page
     */
    static initAll() {
        $(Selectors.ROOT).each(function() {
            new BlogCarousel($(this));
        });
    }

    // -------------------------- END PUBLIC METHODS --------------------------
}

export default BlogCarousel;
