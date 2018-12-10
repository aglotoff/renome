/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
let $nav, $actions;
// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Initialize the header block.
 * @return true
 */
export const initModule = function() {
    const $header = $('.header');

    $nav     = $('.header__nav', $header);
    $actions = $('.header__actions', $header);
};

/**
 * Respond to window resize event.
 *
 * @param {boolean} isMobile - If true, switch to mobile layout. If false,
 * switch to desktop layout
 */
export const handleResize = function(isMobile) {
    // Using the CSS order property results in a disconnect between the visual
    // order and the keyboard navigation order. As a workaround, dynamically
    // adapt the HTML source for the mobile/desktop breakpoint.
    if (!isMobile) {
        $nav.insertBefore($actions);
    } else {
        $nav.insertAfter($actions);
    }
};
// ----------------------------- END PUBLIC METHODS ---------------------------
