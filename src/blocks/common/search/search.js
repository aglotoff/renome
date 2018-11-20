/**
 * @file Implementation of the Header block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
// Constants
const FOCUS_DELAY = 100;
const ESC_KEYCODE = 27;

// Cached jQuery elements
const $search = $('.search');

// State veriables
let focusTimeout = null;
// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN DOM METHODS -----------------------------
const hidePopup = function() {
    $search.removeClass('search_visible'); 
};

const showPopup = function() {
    $search.addClass('search_visible');
};
// ----------------------------- END DOM METHODS ------------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
/**
 * Handle the keydown event.
 * @param {Object} event - jQuery event object
 * @return true
 */
const onDocumentKeydown = function(event) {
    // If the user presses the ESC key, hide the search popup.
    if (event.which === ESC_KEYCODE) {
        toggle(false);
    }
    return true;
};

/**
 * Handle the close button click event.
 * @return true
 */
const onCloseClick = function() {
    toggle(false);
    return true;
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Hide or show the search form
 * @param {*} show A value to determine whether the search form should be
 *     shown or hidden.
 */
export const toggle = function(show) {
    if (show) {
        showPopup();

        // Trigger the focus event after the popup becomes visible
        focusTimeout = setTimeout(function() {
            $('.search__input', $search).focus();
        }, FOCUS_DELAY);
    
        $(document).on('keydown', onDocumentKeydown);
    } else {
        clearTimeout(focusTimeout);

        hidePopup();

        $(document).off('keydown', onDocumentKeydown);
    }
};

/**
 * Initialize the search block.
 */
export const initModule = function() {
    $('.search__close', $search).click(onCloseClick);
};
// ----------------------------- END PUBLIC METHODS ---------------------------
