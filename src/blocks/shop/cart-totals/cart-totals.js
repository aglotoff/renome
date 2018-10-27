/**
 * Cart Totals Block
 */
(function($) {
    $('.page')
        .on('updateTotals', function() {
            $('.cart-totals__inner')
                .addClass('cart-totals__inner_processing')
                .append($('<div></div>')
                    .addClass('loader loader_size_l cart-form__loader'));
        })
        .on('updateShipping', function() {
            $('.cart-totals__inner')
                .addClass('cart-totals__inner_processing')
                .append($('<div></div>')
                    .addClass('loader loader_size_l cart-form__loader'));
        })
        .on('updatedTotals', function(event, total) {
            if (total === 0) {
                $('.cart-totals').remove();
            } else {
                $('.cart-totals__inner')
                    .removeClass('cart-totals__inner_processing')
                    .find('.loader')
                    .remove();

                $('.cart-totals__inner')
                    .find('.cart-totals__subtotal')
                    .add($('.cart-totals__inner')
                        .find('.cart-totals__total'))
                    .text('$' + total.toFixed(2));
            }
        })
        .on('updatedShipping', function() {
            $('.cart-totals__inner')
                .removeClass('cart-totals__inner_processing')
                .find('.loader')
                .remove();
        });
})($);
