const TRANSITION_SPEED = 500;
const PLAY_SPEED = 5000;

$('.slider').each(function() {
    const $slider = $(this);
    const $container = $('.slider__container', $slider);
    const $arrowPrev = $('.slider__arrow_dir_prev', $slider);
    const $arrowNext = $('.slider__arrow_dir_prev', $slider);

    $container.slick({
        autoplay: true,
        autoplaySpeed: PLAY_SPEED,
        rows: 0,
        prevArrow: $arrowPrev,
        nextArrow: $arrowNext,
        cssEase: 'linear',
        fade: true,
        pauseOnFocus: false,
        pauseOnHover: false,
        speed: TRANSITION_SPEED,
        slide: '.slider__slide',
        zIndex: 1,
    });

    // Add a modifier to the active slide
    $container.on('beforeChange', function(e, slick, current, next) {
        slick.$slides.eq(current).removeClass('slider__slide_active');
        slick.$slides.eq(next).addClass('slider__slide_active');
    });
});
