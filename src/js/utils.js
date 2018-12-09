/**
 * @file Miscellaneous utility functions and classes
 * @author Andrey Glotov
 */

/* global focusTrap */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const ESC_KEYCODE = 27;

const $document = $(document);

const focusTrapChain = [];
let currentFocusTrap = null;
// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
const isOutside = function($elem, $container) {
    return (
        !$document.is($elem)
        && !$container.is($elem)
        && ($container.has($elem).length === 0)
    );
};

/**
 * Class implementing generic toggleable functionality for dropdowns and popups
 */
export class Toggleable {
    constructor($container, $switcher, $drawer, options = {}) {
        this._$container = $container;
        this._$switcher  = $switcher;
        this._$drawer    = $drawer;
        this._expanded   = false;

        this._options      = $.extend(
            true,
            {},
            Toggleable.defaultOptions,
            options
        );

        this._onDocumentClick = this._onDocumentClick.bind(this);
        this._onSwitcherClick = this._onSwitcherClick.bind(this);
    
        if (this._options.hoverToggles && this._$container) {
            this._hoverTimeout = null;
            this._onMouseenter = this._onMouseenter.bind(this);
            this._onMouseleave = this._onMouseleave.bind(this);
        }

        if (this._options.escapeHides) {
            this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
        }

        if (this._options.trapFocus) {
            this._focusTrap = focusTrap(this._$drawer.get(0), {
                clickOutsideDeactivates : true,
                initialFocus            : this._options.initialFocus,
            });
        } else if (this._options.focusoutHides && this._$container) {
            this._onDocumentFocusin = this._onDocumentFocusin.bind(this);
        }

        this.unpause();
    }

    _onMouseenter() {
        if (this._hoverTimeout) {
            clearTimeout(this._hoverTimeout);
            this._hoverTimeout = null;
        }

        this.show();
    }

    _onMouseleave() {
        this._hoverTimeout = setTimeout(() => {
            this.hide();
        }, this._options.hoverHideDelay);
    }

    _onDocumentClick(event) {
        if (isOutside($(event.target), this._$drawer)) {
            this.hide();
        }
    }

    _onDocumentFocusin(event) {
        if (isOutside($(event.target), this._$container)) {
            this.hide();
        }
    }

    _onDocumentKeydown(event) {
        if (event.which === ESC_KEYCODE) {
            this.hide();
        }
    }

    _onSwitcherClick() {
        if (!this._expanded) {
            this.show();
        }
    }

    pause() {
        this._$switcher.off('click', this._onSwitcherClick);
        
        if (this._options.hoverToggles && this._$container) {
            this._$container.off({
                mouseenter: this._onMouseenter,
                mouseleave: this._onMouseleave,
            });
        }

        return this;
    }

    unpause() {
        this._$switcher.on('click', this._onSwitcherClick);
        
        if (this._options.hoverToggles && this._$container) {
            this._$container.on({
                mouseenter: this._onMouseenter,
                mouseleave: this._onMouseleave,
            });
        }

        return this;
    }

    show() {
        const {escapeHides, focusoutHides, onToggle, trapFocus} = this._options;

        this._expanded = true;

        setTimeout(() => {
            $document.click(this._onDocumentClick);
        }, 0);

        if (escapeHides) {
            $document.keydown(this._onDocumentKeydown);
        }

        if (trapFocus) {
            setTimeout(() => {
                if (currentFocusTrap) {
                    currentFocusTrap.pause();
                    focusTrapChain.push(currentFocusTrap);
                }

                currentFocusTrap = this._focusTrap;
                currentFocusTrap.activate();
            }, this._options.trapFocusDelay);
        } else if (focusoutHides && this._$container) {
            $document.focusin(this._onDocumentFocusin);
        }

        if (onToggle) {
            onToggle(true);
        }

        return this;
    }

    hide() {
        const {escapeHides, focusoutHides, onToggle, trapFocus} = this._options;

        this._expanded = false;

        $document.off('click', this._onDocumentClick);
        if (escapeHides) {
            $document.off('keydown', this._onDocumentKeydown);
        }

        if (trapFocus) {
            this._focusTrap.deactivate();

            if (focusTrapChain.length > 0) {
                currentFocusTrap = focusTrapChain.pop();
                currentFocusTrap.unpause();
            } else {
                currentFocusTrap = null;
            }
        } else  if (focusoutHides && this._$container) {
            $document.off('focusin', this._onDocumentFocusin);
        }

        if (onToggle) {
            onToggle(false);
        }

        return this;
    }
}

Toggleable.defaultOptions = {
    onToggle      : null,

    clickOutsideHides : true,
    focusoutHides     : true,
    hoverToggles      : true,
    escapeHides       : true,
    trapFocus         : false,

    trapFocusDelay    : 100,
    hoverHideDelay    : 100,
};
// ---------------------------- END PUBLIC METHODS ----------------------------