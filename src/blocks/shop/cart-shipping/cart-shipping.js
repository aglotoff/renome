/**
 * Cart Shipping Block
 */
(function($) {
    $('.cart-shipping__toggle').click(function() {
        $('.cart-shipping__form').slideToggle();
    });

    $('.cart-shipping__country')
        .select2({
            theme: 'renome-alt',
            width: 'style',
            minimumResultsForSearch: Infinity,
            placeholder: 'Select a country',
        })
        .data('select2')
        .$container
        .addClass('cart-shipping__input');

    $('.cart-shipping__form').validate({
        errorClass: 'error cart-shipping__error',

        errorPlacement: function(error, element) {
            if (element.hasClass('cart-shipping__country')) {
                error.insertAfter(element.next('.cart-shipping__input'));
            } else {
                error.insertAfter(element);
            }
        },

        highlight: function(element) {
            if ($(element).hasClass('input')) {
                $(element).addClass('input_invalid');
            } else if ($(element).hasClass('cart-shipping__country')) {
                $(element)
                    .next('.cart-shipping__input')
                    .addClass('select2-container--renome-error');
            }
        },

        unhighlight: function(element) {
            if ($(element).hasClass('input')) {
                $(element).removeClass('input_invalid');
            } else if ($(element).hasClass('cart-shipping__country')) {
                $(element)
                    .next('.cart-shipping__input')
                    .removeClass('select2-container--renome-error');
            }
        },

        submitHandler: function() {
            $('.page').trigger('updateShipping');
            setTimeout(function() {
                $('.page').trigger('updatedShipping');
            }, 1000);
        }
    });
})($);