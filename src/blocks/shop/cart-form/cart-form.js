/**
 * Cart Form Block
 */
(function($) {
    const $formInner = $('.cart-form__inner');

    const mockAjax = function(cb) {
        $formInner.addClass('cart-form__inner_processing');
        const $loader = $('<div></div>')
            .addClass('loader loader_size_l cart-form__loader')
            .appendTo($formInner);

        setTimeout(function() {
            $formInner.removeClass('cart-form__inner_processing');
            $loader.remove();

            cb();
        }, 1000);
    };

    const checkEmptyCart = function() {
        if ($('.cart-form__item', $formInner).length === 0) {
            $formInner
                .html('')
                .append($('<div></div>')
                    .addClass('cart-form__empty-msg')
                    .text('Your cart is currently empty.'))
                .append($('<a></a>')
                    .attr('href', 'shop.html')
                    .addClass('btn cart-form__return')
                    .text('Return to shop'));
        }
    };

    $formInner.on('click', '.cart-form__remove', function() {
        const $item = $(this).closest('.cart-form__item');

        mockAjax(function() {
            $item.remove();

            checkEmptyCart();

            const title = $('.cart-form__product-title', $item).text();
            $('.page').trigger('productRemoved', [title]);
        });
    });

    $('.cart-form__coupon-apply', $formInner).click(function() {
        const code = $(this).prev('.cart-form__coupon-code').val().trim();
        if (code.length == 0) {
            $('.page').trigger('error', 'Please enter a coupon code');
            return false;
        }

        mockAjax(function() {
            $('.page').trigger('error', `Coupon "${code}" does not exist!`);
        });

        return false;
    });

    const onFormInvalid = function() {
        $('.page').trigger('error', ['Please, enter a valid number']);
    };

    const onFormSubmit = function(form) {
        mockAjax(function() {
            const $form = $(form);

            const $items = $('.cart-form__item', $form);

            $items.each(function() {
                const $item = $(this);

                const itemQty = Number($('.cart-form__qty', $item).val());

                if (itemQty === 0) {
                    $item.remove();
                } else {
                    const itemPrice = Number($item
                        .find('.cart-form__product-price')
                        .text()
                        .substr(1));
                    const itemTotal = itemQty * itemPrice;
                    $item
                        .find('.cart-form__total')
                        .text('$' + itemTotal.toFixed(2));
                }
            });

            checkEmptyCart();

            $('.page').trigger('cartUpdated');
        });

        return false;
    };

    $('.cart-form').validate({
        highlight: function(element) {
            $(element).addClass('input_invalid');
        },
        unhighlight: function(element) {
            $(element).removeClass('input_invalid');
        },

        errorPlacement: function() {},

        invalidHandler: onFormInvalid,
        submitHandler: onFormSubmit,
    });

    $('.cart-form__qty').each(function() {
        $(this).rules('add', {
            required: true,
            digits: true,
            min: 0,
        });
    });
})($);