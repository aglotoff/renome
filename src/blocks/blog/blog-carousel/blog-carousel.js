/**
 * @file Implementation of the blog gallery block
 * @author Andrey Glotov
 */

const BLOCK = 'blog-carousel';

const Selectors = {
    ROOT: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
    SLIDE: `.${BLOCK}__slide`,
    ARROW_PREV: `.${BLOCK}__arrow_dir_prev`,
    ARROW_NEXT: `.${BLOCK}__arrow_dir_next`,
};

class BlogCarousel {

    constructor($root) {
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
                breakpoint: 970,
                settings: {
                    dots: true
                },
            }],
        });
    }

    static initAll() {
        $(Selectors.ROOT).each(function() {
            new BlogCarousel($(this));
        });
    }

}

export default BlogCarousel;
