const TRANSITION_SPEED = 250;

$('.blog-gallery__container').slick({
    rows: 0,
    prevArrow: '.blog-gallery__arrow_dir_prev',
    nextArrow: '.blog-gallery__arrow_dir_next',
    cssEase: 'linear',
    dots: false,
    speed: TRANSITION_SPEED,
    slide: '.blog-gallery__slide',
    zIndex: 1,
    responsive: [{
        breakpoint: 970,
        settings: {
            dots: true
        }
    }]
});
