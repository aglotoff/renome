/**
 * @file Implementation of the navigation menu block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const SCROLL_SPEED = 700;   // ID href scroll speed

const $nav = $('.nav');
// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN DOM METHODS -----------------------------
const showSubmenu = function($submenu) {
    $submenu
        .addClass('nav__submenu_visible')
        .scrollTop(0);  // Reset the submenu's scrolling position
};

const hideSubmenu = function($submenu) {
    $submenu.removeClass('nav__submenu_visible');
};

const showMenu = function() {
    $nav
        .addClass('nav_visible')
        .scrollTop(0);  // Reset the menu's scrolling position
};

const hideMenu = function() {
    $nav
        .removeClass('nav_visible')
        .find('.nav__submenu')
        .removeClass('nav__submenu_visible');
};
// ----------------------------- END DOM METHODS ------------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onSubmenuArrowClick = function() {
    showSubmenu($(this).next('.nav__submenu'));
    return true;
};

const onBackArrowClick = function() {
    hideSubmenu($(this).closest('.nav__submenu'));
    return true;
};

const onLocalHrefClick = function() {
    // If the link target is an id attribute, scroll smoothly to the element
    const $target = $($(this).attr('href'));

    if ($target.length !== 0) {
        $('html, body').animate({
            scrollTop: $target.offset().top
        }, SCROLL_SPEED);

        hideMenu();

        return false;
    }
    return true;
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Initialize the navigation menu block.
 */
export const initModule = function() {
    $nav
        .on('click', '.nav__arrow_submenu', onSubmenuArrowClick)
        .on('click', '.nav__arrow_back', onBackArrowClick)
        .on('click', '.nav__link[href^="#"]', onLocalHrefClick);
};

/**
 * Show/hide the menu.
 * @param {*} {boolean} show A value to determine whether the menu should be
 *     shown or hidden.
 */
export const toggleMenu = function(show) {
    if (show) {
        showMenu();
    } else {
        hideMenu();
    }
};
// ----------------------------- END PUBLIC METHODS ---------------------------
