/**
 * Utility to focus.
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const FOCUS_CLASS = 'focus-utility';
const KEY_TAB = 9;

const $root = $('html');

// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN EVENT HANDLERS --------------------------

/**
 * Detect tab key press event and apply the focus utility class to the root
 * element.
 * 
 * @param {jQuery.Event} e The event object
 */
function handleKeyDown(e) {
    if (e.which === KEY_TAB) {
        $root.addClass(FOCUS_CLASS);
    }
}

/**
 * Detect mouse down event and remove the focus utility class when clicked
 * outside of the active element.
 * 
 * @param {jQuery.Event} e The event object
 */
function handleMouseDown(e) {
    const $activeElement = $(':focus');
    if ($activeElement.length === 0) {
        return;
    }

    const target = e.target;
    if (!(
        target === document
        || $activeElement.is($(target))
        || $.contains($activeElement.get(0), target)
    )) {
        $root.removeClass(FOCUS_CLASS);
    }
}

// ----------------------------- END EVENT HANDLERS ---------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------

/**
 * Initialize the focus utility.
 */
export function init() {
    $root.on({
        keydown: handleKeyDown,
        mousedown: handleMouseDown,
    });
}

// ----------------------------- END PUBLIC METHODS ---------------------------
