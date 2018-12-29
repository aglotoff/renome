/**
 * @file Implementation of the product gallery block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
let $gallery, $slider, $links;
// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onSliderBeforechange = function(event, slick, currentSlide, nextSlide) {
    $links.each(function() {
        const $link = $(this);
        $link.toggleClass(
            'product-gallery__thumb-link_active',
            $link.attr('data-slide') == nextSlide
        );
    });
};

const onLinkClick = function(event) {
    event.preventDefault();
    $slider.slick('slickGoTo', $(this).attr('data-slide'));
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the product gallery module.
 * @return true if the product gallery block is present, false otherwise
 */
export const initModule = function() {
    $gallery = $('.product-gallery');
    if ($gallery.length === 0) {
        return false;
    }

    $links = $gallery.find('.product-gallery__thumb-link');

    $slider = $gallery.find('.product-gallery__container');
    $slider.slick({
        rows      : 0,
        slide      : '.product-gallery__slide',

        arrows    : false,
        dots      : false,

        fade       : true,
        speed      : 400,
        zIndex     : 1,

        responsive : [{
            breakpoint : 768,
            settings   : {
                dots: true
            }
        }]
    });

    $slider.on('beforeChange', onSliderBeforechange);
    $gallery.on('click', '.product-gallery__thumb-link', onLinkClick);

    return false;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
