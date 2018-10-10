/**
 * Header Block
 */
(function($) {
    const DESKTOP_BREAKPOINT = 992; // Min desktop screen width

    // Use a custom event to show the site search form
    $('.header__search-toggle').click(function() {
        $('.page').trigger('search');
    });
    
    let navVisible = false;

    // Hide the mobile nav menu
    function hideNav() {
        $('.page').trigger('hideNav');

        $('.header__nav-toggle')
            .removeClass('hamburger_open')
            .attr('aria-expanded', false);

        navVisible = false;
    }
    
    // Show the mobile nav menu
    function showNav() {
        $('.page').trigger('showNav');

        $('.header__nav-toggle')
            .addClass('hamburger_open')
            .attr('aria-expanded', true);

        navVisible = true;
    }

    $('.header__nav-toggle').click(function() {
        if (navVisible) {
            hideNav();
        } else {
            showNav();
        }
    });

    let mobile = window.outerWidth < DESKTOP_BREAKPOINT;

    // Automatically hide the mobile nav menu when switched to desktop screens
    $(window).resize(function() {
        if (mobile && ($(window).width() >= DESKTOP_BREAKPOINT)) {
            if (navVisible) {
                hideNav();
            }

            mobile = false;
        } else if (!mobile && (window.innerWidth < DESKTOP_BREAKPOINT)) {
            mobile = true;
        }
    });
})($);
