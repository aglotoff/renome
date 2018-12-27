/**
 * @file Implementation of the search block
 * @author Andrey Glotov
 */

/* global focusTrap */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the search module.
 * @return true
 */
export const initModule = function() {
    const $page   = $('.page');
    const $search = $('.search');
    const $close  = $search.find('.search__close');

    const popupFocusTrap = focusTrap($search.get(0), {
        clickOutsideDeactivates : true,
        escapeDeactivates       : true,
        
        onDeactivate            : function onSearchDeactivate() {
            $search.removeClass('search_visible');
        },
    });

    $page.on('search', function onSearchToggle() {
        $search.addClass('search_visible');

        // Need to wait 100ms before autofocus works.
        setTimeout(function() {
            popupFocusTrap.activate();
        }, 100);
    });

    $close.click(function onSearchClose() {
        popupFocusTrap.deactivate();
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
