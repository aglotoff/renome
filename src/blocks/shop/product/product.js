$('.product__add-btn').click(function() {
    const $loader = $('<span></span>')
        .addClass('loader loader_size_s product__add-loader')
        .insertAfter($(this));

    $(this).remove();

    setTimeout(function() {
        $('<a></a>')
            .attr('href', 'shop-cart.html')
            .addClass('product__cart-link')
            .text('Product added')
            .insertAfter($loader);

        $loader.remove();
    }, 1000);
});
