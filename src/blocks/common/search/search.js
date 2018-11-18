// Hide the site search form
$('.search__close').click(function() {
    $(this).closest('.search').removeClass('search_visible');
});

// Show the site search form on a custom event
$('.page').on('search', function() {
    $('.search').addClass('search_visible');

    // Wait until the input field becomes visible and then focus on it
    setTimeout(function() {
        $('.search__input').get(0).focus();
    }, 100);
});
