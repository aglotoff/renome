/**
 * Nav Menu Block
 */
(function($) {
    const SCROLL_SPEED = 700;

    // Show mobile submenu
    $('.nav').on('click', '.nav__arrow_submenu', function() {
        $(this)
            .next('.nav__submenu')
            .addClass('nav__submenu_visible')
            .scrollTop(0);  // Reset the submenu's scrolling position
    });

    // Hide mobile submenu
    $('.nav').on('click', '.nav__arrow_back', function() {
        $(this)
            .closest('.nav__submenu')
            .removeClass('nav__submenu_visible');
    });

    // Show the mobile nav menu
    $('.page').on('showNav', function() {
        $('.nav')
            .addClass('nav_visible')
            .scrollTop(0);  // Reset the menu's scrolling position
    });

    // Hide the mobile nav menu
    $('.page').on('hideNav', function() {
        $('.nav')
            .removeClass('nav_visible')
            .find('.nav__submenu')
            .removeClass('nav__submenu_visible');
    });

    // If the link target is an id attribute, scroll smoothly to the element
    $('.nav').on('click', '.nav__link[href^="#"]', function() {
        const $target = $($(this).attr('href'));
        
        if ($target.length != 0) {
            $('html, body').animate({
                scrollTop: $target.offset().top
            }, SCROLL_SPEED);

            return false;
        }
    });
})($);
