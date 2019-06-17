/**
 * Force a reflow
 * @param {JQuery} el The element whose styles have been changed
 */
export default function forceReflow($el) {
    void($el.get(0).offsetHeight);
}
