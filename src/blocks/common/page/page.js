/**
 * Page Block
 */
(function($) {
    const STICKY_OFFSET = 100;
    const VISIBLE_OFFSET = 400;
    
    const headerIsTransparent = $('.header').hasClass('header_transparent');

    // Animate sticky header
    function handleScroll() {
        const offset = $(window).scrollTop();

        $('.page__header')
            .toggleClass(
                'page__header_scroll',
                offset >= STICKY_OFFSET
            )
            .toggleClass(
                'header_transparent',
                headerIsTransparent && (offset < STICKY_OFFSET)
            )
            .toggleClass(
                'page__header_hidden',
                (offset > STICKY_OFFSET) && (offset < VISIBLE_OFFSET)
            );
    }
    
    $(window).on('scroll', handleScroll);
    
    // Handle initial scroll position
    handleScroll();
})($);
