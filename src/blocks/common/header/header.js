/**
 * @file Implementation of the header block
 * @author Andrey Glotov
 */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the header module.
 * @return true;
 */
export const initModule = function() {
    const $page         = $('.page');
    const $searchToggle = $('.header__search-toggle');

    $searchToggle.click(function onSearchToggle() {
        $page.trigger('search');
    });
};
// ---------------------------- END PUBLIC METHODS ----------------------------
