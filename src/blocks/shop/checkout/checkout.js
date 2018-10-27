/**
 * Checkout Page Block
 */
(function($) {
    $('.checkout__select').each(function() {
        $(this)
            .select2({
                theme: 'renome',
                width: 'style',
                minimumResultsForSearch: Infinity,
            })
            .data('select2')
            .$container
            .addClass('checkout__select2');
    });

    $('.checkout__toggle-input').change(function() {
        $('#' + $(this).data('target-id')).slideToggle();
    });

    $('.checkout__payment-item').click(function() {
        $('.checkout__payment-radio', $(this))
            .prop('checked', true)
            .change();
    });

    $('.checkout__payment-radio').change(function() {
        $(this)
            .closest('.checkout__payments')
            .find('.checkout__payment-item')
            .each(function() {
                const isChecked = $('.checkout__payment-radio', $(this))
                    .prop('checked');
                
                if (isChecked) {
                    $('.checkout__payment-desc', $(this))
                        .slideDown();
                } else {
                    $('.checkout__payment-desc', $(this))
                        .slideUp();
                }
            });
    });

    $('.checkout').validate({
        errorClass: 'error checkout__error',

        ignore: '.checkout__input:hidden',

        highlight: function(element) {
            if ($(element).hasClass('input')) {
                $(element).addClass('input_invalid');
            }
        },

        unhighlight: function(element) {
            if ($(element).hasClass('input')) {
                $(element).removeClass('input_invalid');
            }
        },

        errorPlacement: function(error, element) {
            if (element.attr('name') === 'payment') {
                element
                    .closest('.checkout__payments')
                    .prepend(error);
            } else {
                error.insertAfter(element);
            }
        },

        messages: {
            payment: 'Please select a payment method',
        },
    });
})($);
