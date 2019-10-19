/**
 * Force a reflow
 * @param {JQuery} el The element whose styles have been changed
 */
export function forceReflow($el) {
    void($el.get(0).offsetHeight);
}

/**
 * Get size of ems in pixels
 * 
 * @param {JQuery} $elem The element whose em size is to be computed
 * @return {number} The size of ems in pixels
 */
export function getEmSize( $elem ) {
    return +$elem.css('font-size').match(/\d*\.?\d*/)[0];
}

/**
 * Debounce function execution
 * 
 * @param {function} cb The function to execute
 * @param {number} interval The debouncing interval in milliseconds
 * @return {function} The debounced function
 */
export function debounce(cb, interval) {
    let timer = null;

    return function() {
        clearTimeout(timer);
        timer = setTimeout(cb, interval);
    };
}

/**
 * Throttle function execution
 * 
 * @param {function} cb The function to execute
 * @param {number} interval The throttling interval in milliseconds
 * @return {function} The throttled function
 */
export function throttle(cb, interval) {
    let called = false;
    let timer = null;

    return function() {
        if (timer !== null) {
            // Ensure that we catch and execute that last invocation.
            called = true;
            return;
        }

        cb();

        timer = this.setTimeout(function() {
            timer = null;
            if (called) {
                cb();
                called = false;
            }
        }, interval);
    };
}
