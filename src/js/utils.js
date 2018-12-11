/**
 * @file Miscellaneous utility functions and classes
 * @author Andrey Glotov
 */

/* global focusTrap */

const ESC_KEYCODE = 27;

const $document = $(document);

const dropdownProto = {
    _onOutsideClick(event) {
        if (!$.contains(this._$container.get(0), event.target)) {
            this.hide();
        }
    },

    _onSwitcherClick() {
        if (!this._isExpanded) {
            this.show();
        } else {
            this.hide();
        }
    },

    _onKeydown(event) {
        if (event.which === ESC_KEYCODE) {
            this.hide();
            this._$switcher.focus();
        }
    },

    show() {
        this._isExpanded = true;

        this._$switcher.attr('aria-expanded', 'true');

        $document.on({
            click   : this._onOutsideClick,
            focusin : this._onOutsideClick,
        });
        this._$container.on('keydown', this._onKeydown);

        if (this._onToggle) {
            this._onToggle(true);
        }
    },

    hide() {
        this._isExpanded = false;

        this._$switcher.attr('aria-expanded', 'false');

        $document.off({
            click   : this._onOutsideClick,
            focusin : this._onOutsideClick,
        });
        this._$container.off('keydown', this._onKeydown);

        if (this._onToggle) {
            this._onToggle(false);
        }
    },

    pause() {
        this._$switcher
            .off('click', this._onSwitcherClick)
            .attr({
                'aria-expanded': '',
                'aria-haspopup': '',
            });

        if (this._isExpanded) {
            $document.off({
                click   : this._onOutsideClick,
                focusin : this._onOutsideClick,
            });
        }

        if (this._hoverToggles) {
            this._$container.off({
                mouseenter : this._onMouseenter,
                mouseleave : this._onMouseleave,
            });
        }
    },

    unpause() {
        this._$switcher
            .click(this._onSwitcherClick)
            .attr({
                'aria-expanded': String(this._isExpanded),
                'aria-haspopup': 'true'
            });

        if (this._isExpanded) {
            $document.on({
                click   : this._onOutsideClick,
                focusin : this._onOutsideClick,
            });
        }

        if (this._hoverToggles) {
            this._$container.hover(this._onMouseenter, this._onMouseleave);
        }
    },
};

export const makeDropdown = function($container, $switcher, options) {
    const dropdown = Object.create(dropdownProto);

    dropdown._$container   = $container;
    dropdown._$switcher    = $switcher;
    dropdown._onToggle     = options.onToggle;
    dropdown._hoverToggles = !!options.hoverToggles;
    dropdown._isExpanded   = false;

    // Bind the event handlers
    dropdown._onOutsideClick  = dropdown._onOutsideClick.bind(dropdown);
    dropdown._onSwitcherClick = dropdown._onSwitcherClick.bind(dropdown);
    dropdown._onKeydown       = dropdown._onKeydown.bind(dropdown);

    if (options.hoverToggles) {
        dropdown._onMouseenter = dropdown.show.bind(dropdown);
        dropdown._onMouseleave = dropdown.hide.bind(dropdown);
    }

    dropdown.unpause();

    return dropdown;
};

let activeModal = null;

const modalProto = {
    _onDocumentClick(event) {
        if (!$.contains(this._$container.get(0), event.target)) {
            this.deactivate();
        }
    },

    _onTrapDeactivate() {
        $document.off('click', this._onDocumentClick);

        if (activeModal === this) {
            activeModal = this._prev;
        }

        if (this._prev) {
            this._prev._next = this._next;
            this._prev._trap.unpause();
            this._prev = null;
        }
        if (this._next) {
            this._next._prev = this._prev;
            this._next = null;
        }

        if (this._onToggle) {
            this._onToggle(false);
        }
    },

    show() {
        if (activeModal) {
            activeModal._trap.pause();
        }

        this._prev = activeModal;
        this._next = null;

        activeModal = this;

        if (this._onToggle) {
            this._onToggle(true);
        }

        setTimeout(() => {
            $document.click(this._onDocumentClick);

            this._trap.activate();
        }, this._focusDelay || 0);
    },

    hide() {
        this._trap.deactivate();
    },
};

export const makeModal = function($container, options) {
    const trap = Object.create(modalProto);

    trap._$container = $container;
    trap._onToggle   = options.onToggle;
    trap._focusDelay = options.focusDelay;
    trap._prev       = null;
    trap._next       = null;

    trap._trap = new focusTrap($container.get(0), {
        initialFocus            : options.initialFocus,
        clickOutsideDeactivates : true,
        escapeDeactivates       : true,
        onDeactivate            : trap._onTrapDeactivate.bind(trap),
    });

    trap._onDocumentClick = trap._onDocumentClick.bind(trap);

    return trap;
};
