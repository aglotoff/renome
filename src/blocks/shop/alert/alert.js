/**
 * Alert Box Block
 */
(function($) {
    const SCROLL_SPEED = 400;

    const $alert = $('.alert');

    const showAlert = function() {
        $alert.addClass('alert_visible');
        $('html, body').animate({
            scrollTop: $alert.offset().top - 100
        }, SCROLL_SPEED);
    };

    $('.page')
        .on('addProduct', function(event, title) {
            $alert
                .html('')
                .append($('<div></div>')
                    .addClass('alert__msg')
                    .text(`"${title}" was successfully added to your cart.`))
                .append($('<a></a>')
                    .addClass('alert__cart-link')
                    .attr('href', 'shop-cart.html')
                    .text('View cart'));
            showAlert();
        })
        .on('error', function(event, message) {
            $alert
                .html('')
                .append($('<div></div>')
                    .addClass('alert__msg')
                    .text(message));
            showAlert();
        });
})($);
