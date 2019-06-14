/**
 * @file Implementation of the drilldown strategy for menus
 * @author Andrey Glotov
 */

/* global focusTrap */

// ------------------------- BEGIN MODULE VARIABLES ---------------------------

const $document = $(document);

const drilldownChain = [];
let activeDrilldown = null;

// -------------------------- END MODULE VARIABLES ----------------------------

export default class DrilldownStrategy {
    /**
     * Create a drilldown strategy
     * @param {JQuery} $trigger The drilldown button
     * @param {JQuery} $drawer The drilldown drawer
     * @param {JQuery} $initialFocus The element to receive initialFocus
     * @param {Object} $options Options object
     */
    constructor($trigger, $drawer, $initialFocus, options = {}) {
        this._elements = { $trigger, $drawer, $initialFocus };
        this._isExpanded = false;

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleTriggerClick = this.handleTriggerClick.bind(this);
        this.handleTrapDeactivate = this.handleTrapDeactivate.bind(this);

        this._handlers = {
            collapseHandler: options.on && options.on.collapse,
            expandHandler: options.on && options.on.expand,
        };

        this._focusTrap = new focusTrap($drawer.get(0), {
            clickOutsideDeactivates: true,
            escapeDeactivates: true,
            initialFocus: $initialFocus && $initialFocus.get(0),
            onDeactivate: this.handleTrapDeactivate,
        });
    }

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    handleOutsideClick(event) {
        if (!$.contains(this._elements.$drawer.get(0), event.target)) {
            this.collapse();
        }
    }

    handleTriggerClick() {
        this.toggle();
    }

    handleTrapDeactivate() {
        $document.off('click', this.handleDocumentClick);

        if (drilldownChain.length !== 0) {
            const prevDrilldown = drilldownChain.pop();

            if (prevDrilldown._isExpanded) {
                activeDrilldown = prevDrilldown;
                activeDrilldown._focusTrap.unpause();
            }
        } else {
            activeDrilldown = null;
        }

        this._isExpanded = false;

        this._elements.$trigger.attr('aria-expanded', 'false');

        if (this._handlers.collapseHandler) {
            this._handlers.collapseHandler();
        }
    }

    // --------------------------- END EVENT HANDLERS -------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Expand the drilldown menu
     */
    expand() {
        this._isExpanded = true;

        if (activeDrilldown) {
            activeDrilldown._focusTrap.pause();
            drilldownChain.push(activeDrilldown);
        }

        activeDrilldown = this;

        this._focusTrap.activate();

        setTimeout(() => {
            $document.click(this.handleDocumentClick);

            if (this._handlers.expandHandler) {
                this._handlers.expandHandler();
            }
        }, 0);

        this._elements.$trigger.attr('aria-expanded', 'true');
    }

    /**
     * Collapse the drilldown menu
     */
    collapse() {
        this._focusTrap.deactivate();
    }

    /**
     * Toggle between the collapsed and expanded states
     */
    toggle() {
        if (!this._isExpanded) {
            this.expand();
        } else {
            this.collapse();
        }
    }

    /**
     * Activate the strategy: add event listeners.
     */
    activate() {
        this._elements.$trigger.click(this.handleTriggerClick);
        this._elements.$drawer.keydown(this.handleKeyDown);
    }

    /**
     * Deactivate the strategy: collapse the dropdown and remove event
     * listeners.
     */
    deactivate() {
        if (this._isExpanded) {
            this.collapse();
        }

        this._elements.$trigger.off('click', this.handleTriggerClick);
        this._elements.$drawer.off('keydown', this.handleKeyDown);
    }
}
