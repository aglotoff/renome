$('.product-images').each(function() {
    const $gallery = $(this);
    const $slider = $('.product-images__container', $gallery);

    $slider.slick({
        rows: 0,
        arrows: false,
        cssEase: 'linear',
        dots: false,
        fade: true,
        speed: 400,
        slide: '.product-images__slide',
        zIndex: 1,
        responsive: [{
            breakpoint: 768,
            settings: {
                dots: true
            }
        }]
    });

    $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        $('.product-images__thumb', $gallery).each(function() {
            $(this).toggleClass(
                'product-images__thumb_active',
                $(this).attr('data-slide') == nextSlide
            );
        });
    });

    $gallery.on('click', '.product-images__thumb', function() {
        $slider.slick('slickGoTo', $(this).attr('data-slide'));
    });
});
