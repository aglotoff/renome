/**
 * @file Implementation of the Header block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const DESKTOP_BREAKPOINT  = 992;    // Min desktop screen width

const $page = $('.page');
const $navToggle = $('.header__nav-toggle');
const $searchToggle = $('.header__search-toggle');

let isNavVisible = false;
let isMobile = true;
// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN DOM METHODS -----------------------------
/**
 * Show or hide the nav menu.
 * @param {boolean} show A value to determine whether the nav menu should be
 *     shown or hidden.
 */
const toggleNav = function(show) {
    $page.trigger(show ? 'showNav' : 'hideNav');

    $navToggle
        .toggleClass('hamburger_open', show)
        .attr('aria-expanded', show);

    isNavVisible = show;
};
// ----------------------------- END DOM METHODS ------------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onSearchToggle = function() {
    $page.trigger('search');
};

const onNavToggle = function() {
    toggleNav(!isNavVisible);
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Automatically hide the mobile nav menu when switched to desktop screens
 */
export const handleResize = function() {
    if (isMobile && ($(window).outerWidth() >= DESKTOP_BREAKPOINT)) {
        if (isNavVisible) {
            toggleNav(false);
        }

        isMobile = false;
    } else if (!isMobile && ($(window).outerWidth() < DESKTOP_BREAKPOINT)) {
        isMobile = true;
    }
};

/**
 * Initialize the header block.
 */
export const initModule = function() {
    isMobile = $(window).outerWidth() < DESKTOP_BREAKPOINT;

    $searchToggle.click(onSearchToggle);
    $navToggle.click(onNavToggle);
};
// ----------------------------- END PUBLIC METHODS ---------------------------
