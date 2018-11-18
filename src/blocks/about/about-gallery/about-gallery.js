$('.about-gallery').each(function() {
    $(this).magnificPopup({
        delegate: '.about-gallery__thumb-link',
        mainClass: 'lightbox',
        gallery: {
            enabled: true,
            tCounter: '',
        },
    });
});
