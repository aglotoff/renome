/**
 * @file Implementation of the product gallery block
 * @author Andrey Glotov
 */

import { getEmSize } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const BLOCK = 'product-gallery';

const Selectors = {
    ROOT: `.${BLOCK}`,
    CONTAINER: `.${BLOCK}__container`,
    NAV: `.${BLOCK}__nav`,
    SLIDE: `.${BLOCK}__slide`,
    THUMB: `.${BLOCK}__thumb`,
};

// --------------------------- END MODULE VARIABLES ---------------------------

const $gallery = $('.product-gallery');
if ($gallery.length !== 0) {
    const pageEmSize = getEmSize($('.page'));

    const $container = $(Selectors.CONTAINER, $gallery);
    const $nav = $(Selectors.NAV, $gallery);

    $container.slick({
        rows: 0,
        slide: Selectors.SLIDE,

        arrows: false,
        dots: false,

        fade: true,
        speed: 400,
        zIndex: 1,

        responsive: [{
            breakpoint: 30 * pageEmSize,
            settings: {
                dots: true
            }
        }],

        asNavFor: $nav,
    });

    $nav.slick({
        rows: 0,
        slide: Selectors.THUMB,

        focusOnSelect: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        vertical: true,
        verticalSwiping: true,

        zIndex: 1,

        arrows: false,
        dots: false,

        responsive: [{
            breakpoint: 62 * pageEmSize,
            settings: {
                slidesToShow: 3,
            }
        }, {
            breakpoint: 48 * pageEmSize,
            settings: {
                slidesToShow: 4,
            }
        }, {
            breakpoint: 30 * pageEmSize,
            settings: {
                slidesToShow: 3,
            }
        }],

        asNavFor: $container,
    });
}
