/**
 * Menu Product Block
 */
$('.menu').each(function() {
    $(this).magnificPopup({
        delegate: '.menu-product__link',
        mainClass: 'lightbox',
        type: 'image',
    });
});
