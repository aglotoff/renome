const SCROLL_SPEED = 400;

const $alert = $('.alert');

const showAlert = function() {
    $alert.addClass('alert_visible');
    $('html, body').animate({
        scrollTop: $alert.offset().top - 100
    }, SCROLL_SPEED);
};

const showMessage = function(message) {
    $alert
        .html('')
        .append($('<div></div>')
            .addClass('alert__msg')
            .text(message));
    
    showAlert();
};

const showMessageAndLink = function(message, link) {
    $alert
        .html('')
        .append($('<div></div>')
            .addClass('alert__msg')
            .text(message))
        .append($('<a></a>')
            .addClass('alert__link')
            .attr('href', 'shop-cart.html')
            .text(link));
    
    showAlert();
};

$('.page')
    .on('addProduct', function(event, title) {
        showMessageAndLink(
            `"${title}" was successfully added to your cart.`,
            'View cart'
        );
    })
    .on('error', function(event, message) {
        showMessage(message);
    })
    .on('cartUpdated', function() {
        showMessage('Cart updated.');
    })
    .on('productRemoved', function(event, title) {
        showMessageAndLink(`"${title}" removed.`, 'Undo?');
    });
