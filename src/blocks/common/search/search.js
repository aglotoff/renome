/**
 * @file Implementation of the search block
 * @author Andrey Glotov
 */

/* global focusTrap */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'search';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    CLOSE: `.${BLOCK}__close`,
};

// Element class names
const CLASSES = {
    BLOCK_VISIBLE: `${BLOCK}_visible`,
};

const elements = {};
let popupFocusTrap;

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the search block
 */
function initBlock() {
    const $search = $(SELECTORS.BLOCK);
    const $close = $(SELECTORS.CLOSE, $search);

    elements.$search = $search;

    popupFocusTrap = focusTrap($search.get(0), {
        clickOutsideDeactivates: true,
        escapeDeactivates: true,
        
        onDeactivate: function handleSearchDeactivate() {
            $search.removeClass(CLASSES.BLOCK_VISIBLE);
        },
    });

    $close.click(hide);
}

// ---------------------------- END PRIVATE METHODS ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Show the search modal
 */
export function show() {
    elements.$search.addClass(CLASSES.BLOCK_VISIBLE);

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

initBlock();
