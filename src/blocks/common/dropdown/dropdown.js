/**
 * @file Implementation of the dropdown block
 * @author Andrey Glotov
 */

// ----------------------------- BEGIN CONSTANTS ------------------------------

const $document = $(document);

const Keys = {
    ESC: 27,
    SPACE: 32
};

// ------------------------------ END CONSTANTS -------------------------------

/**
 * Dropdown implementation
 */
class Dropdown {
    /**
     * Create a dropdown
     * @param {JQuery} $root The root node
     */
    constructor($root) {
        this._elements = { $root };

        this._elements.$toggle = $('.dropdown__toggle', $root);
        this._elements.$drawer = $('.dropdown__drawer', $root);

        this._isExpanded = false;

        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleToggleClick = this.handleToggleClick.bind(this);
        this.handleToggleKeyDown = this.handleToggleKeyDown.bind(this);
        this.handleToggleKeyUp = this.handleToggleKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);

        this._elements.$toggle.on({
            click: this.handleToggleClick,
            keydown: this.handleToggleKeyDown,
            keyup: this.handleToggleKeyUp,
        });
        this._elements.$root.on({
            mouseenter: this.handleMouseEnter,
            mouseleave: this.handleMouseLeave,
        });
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
            this._elements.$toggle.focus();
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

            this._elements.$toggle.attr('aria-expanded', 'true');
            this._elements.$drawer.addClass('dropdown__drawer_expanded');
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

        this._elements.$toggle.attr('aria-expanded', 'false');
        this._elements.$drawer.removeClass('dropdown__drawer_expanded');
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
     * Initialize all dropdown blocks on the page
     */
    static initAll() {
        $('.dropdown').each(function() {
            new Dropdown($(this));
        });
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

export default Dropdown;
