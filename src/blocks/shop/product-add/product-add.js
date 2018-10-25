/**
 * Product Add Form Block
 */
$('.product-add').submit(function() {
    const $qty = $('.product-add__qty', $(this));
    // const $id = $('.product-add__id', $(this));

    const quantity = Number($qty.val(), 10);
    // const productId = $id.val();

    if (isNaN(quantity) || (~~quantity != quantity) || (quantity < 1)) {
        $qty.focus();
        $('.page').trigger('error', 'Please enter a valid quantity.');
    } else {
        // TODO: send quantity and product id to the server

        $('.page').trigger('addProduct', ['Korean bibimbap']);
    }

    return false;
});
