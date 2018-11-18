$('.shop-cats__toggle').click(function() {
    const $list = $(this).next('.shop-cats__list');
    
    $list.addClass('shop-cats__list_visible');

    setTimeout(function() {
        $(document).one('click', function() {
            $list.removeClass('shop-cats__list_visible');
        });
    });
});
