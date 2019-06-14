/**
 * @file Implementation of the dropdown strategy for menus
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const $document = $(document);

const Keys = {
    ESC: 27,
    SPACE: 32
};

// --------------------------- END MODULE VARIABLES ---------------------------

export default class DropdownStrategy {
    /**
     * Create a dropdown strategy
     * @param {JQuery} $root The root node
     * @param {JQuery} $trigger The dropdown button
     * @param {JQuery} $drawer The dropdown drawer
     * @param {Object} $options Options object
     */
    constructor($root, $trigger, $drawer, options = {}) {
        this._elements = { $root, $trigger, $drawer };
        this._isExpanded = false;

        this._handlers = {
            collapseHandler: options.on && options.on.collapse,
            expandHandler: options.on && options.on.expand,
        };

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleToggleKeyDown = this.handleToggleKeyDown.bind(this);
        this.handleToggleKeyUp = this.handleToggleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
    }

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    handleOutsideClick(event) {
        const target = event.target;
        if (!(
            target === document
            || this._elements.$root.is($(target))
            || $.contains(this._elements.$root.get(0), target)
        )) {
            this.collapse();
        }
    }

    handleToggleClick() {
        this.toggle();
    }

    handleToggleKeyDown(event) {
        if (event.which === Keys.SPACE) {
            event.preventDefault();

            this.toggle();
        }
    }

    handleToggleKeyUp(event) {
        if (event.which === Keys.SPACE) {
            event.preventDefault();
        }
    }

    handleKeyDown(event) {
        if (event.which === Keys.ESC) {
            this.collapse();
            this._elements.$trigger.focus();
        }
    }

    handleMouseEnter() {
        this.expand();
    }

    handleMouseLeave() {
        this.collapse();
    }

    // --------------------------- END EVENT HANDLERS -------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Expand the dropdown
     */
    expand() {
        this._isExpanded = true;

        setTimeout(() => {
            $document.on({
                click: this.handleOutsideClick,
                focusin: this.handleOutsideClick,
            });
            this._elements.$root.on('keydown', this.handleKeyDown);

            this._elements.$trigger.attr('aria-expanded', 'true');

            if (this._handlers.expandHandler) {
                this._handlers.expandHandler();
            }
        }, 0);
    }

    /**
     * Collapse the dropdown
     */
    collapse() {
        this._isExpanded = false;

        $document.off({
            click: this.handleOutsideClick,
            focusin: this.handleOutsideClick,
        });
        this._elements.$root.off('keydown', this.handleKeyDown);

        this._elements.$trigger.attr('aria-expanded', 'false');

        if (this._handlers.collapseHandler) {
            this._handlers.collapseHandler();
        }
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
        this._elements.$root.on({
            mouseenter: this.handleMouseEnter,
            mouseleave: this.handleMouseLeave,
        });

        this._elements.$trigger.on({
            click: this.handleToggleClick,
            keydown: this.handleToggleKeyDown,
            keyup: this.handleToggleKeyUp,
        });
    }

    /**
     * Deactivate the strategy: collapse the dropdown and remove event
     * listeners.
     */
    deactivate() {
        if (this._isExpanded) {
            this.collapse();
        }

        this._elements.$root.off({
            mouseenter: this.handleMouseEnter,
            mouseleave: this.handleMouseLeave,
        });

        this._elements.$trigger.off({
            click: this.handleToggleClick,
            keydown: this.handleToggleKeyDown,
            keyup: this.handleToggleKeyUp,
        });
    }
}
