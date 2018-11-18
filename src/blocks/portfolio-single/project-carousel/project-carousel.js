const TRANSITION_SPEED = 250;

$('.project-carousel__container').slick({
    rows: 0,
    prevArrow: '.project-carousel__arrow_dir_prev',
    nextArrow: '.project-carousel__arrow_dir_next',
    cssEase: 'linear',
    dots: true,
    speed: TRANSITION_SPEED,
    slide: '.project-carousel__slide',
    zIndex: 1,
});
