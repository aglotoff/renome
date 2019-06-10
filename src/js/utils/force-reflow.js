/**
 * Force a reflow
 * @param {HTMLElement} el The element whose styles have been changed
 */
export default function forceReflow(el) {
    void(el.offsetHeight);
}
