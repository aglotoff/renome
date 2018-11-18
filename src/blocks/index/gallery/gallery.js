$('.gallery').each(function() {
    $(this).magnificPopup({
        delegate: '.gallery__thumb-link',
        mainClass: 'lightbox',
        type: 'image',
        gallery: {
            enabled: true,
            tCounter: '',
        },
    });
});
