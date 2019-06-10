/**
 * @file Implementation of the search block
 * @author Andrey Glotov
 */

/* global focusTrap */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
let $search;
let popupFocusTrap;
// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the search block.
 * @return true
 */
function initBlock() {
    $search = $('.search');
    const $close = $search.find('.search__close');

    popupFocusTrap = focusTrap($search.get(0), {
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        
        onDeactivate: function handleSearchDeactivate() {
            $search.removeClass('search_visible');
        },
    });

    $close.click(hide);

    return true;
}

/**
 * Show the search modal
 */
function show() {
    $search.addClass('search_visible');

    // Need to wait 100ms for autofocus to work
    // TODO: why?
    setTimeout(() => {
        popupFocusTrap.activate();
    }, 100);
}

/**
 * Hide the search modal
 */
function hide() {
    popupFocusTrap.deactivate();
}

// ---------------------------- END PUBLIC METHODS ----------------------------

export default {
    initBlock,
    show,
    hide,
};
