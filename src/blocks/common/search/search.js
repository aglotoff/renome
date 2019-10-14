/**
 * @file Implementation of the search block
 * @author Andrey Glotov
 */

/* global focusTrap */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const $search = $('.search');
const $close = $search.find('.search__close');

const popupFocusTrap = focusTrap($search.get(0), {
    clickOutsideDeactivates: true,
    escapeDeactivates: true,
    
    onDeactivate: function handleSearchDeactivate() {
        $search.removeClass('search_visible');
    },
});

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Show the search modal
 */
export function show() {
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
export function hide() {
    popupFocusTrap.deactivate();
}

// ---------------------------- END PUBLIC METHODS ----------------------------

$close.click(hide);