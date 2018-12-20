/**
 * @file Implementation of the search block
 * @author Andrey Glotov
 */

/* global focusTrap */

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the search module.
 * @return true;
 */
export const initModule = function() {
    const $search = $('.search');
    const $toggle = $search.find('.search__toggle');
    const $popup  = $search.find('.search__popup');
    const $close  = $search.find('.search__close');

    const popupFocusTrap = focusTrap($popup.get(0), {
        clickOutsideDeactivates : true,
        escapeDeactivates       : true,
        
        onDeactivate            : function onSearchDeactivate() {
            $popup.removeClass('search__popup_visible');
        },
    });

    $toggle.click(function onSearchToggle() {
        $popup.addClass('search__popup_visible');

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
