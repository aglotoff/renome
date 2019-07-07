/**
 * @file Implementation of the select block
 * @author Andrey Glotov
 */

/* global Popper */

// ----------------------------- BEGIN CONSTANTS ------------------------------

const BLOCK = 'select';

const ClassNames = {
    ORIGIN: `${BLOCK}__origin`,
    BUTTON: `${BLOCK}__button`,
    LIST: `${BLOCK}__list`,
    LIST_EXPANDED: `${BLOCK}__list_expanded`,
    OPTION: `${BLOCK}__option`,
    OPTION_HIGHLIGHTED: `${BLOCK}__option_highlighted`,
    ERROR: `${BLOCK}_error`,
};

const Selectors = {
    OPTION: `.${BLOCK}__option`,
};

const Keys = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    END: 35,
    HOME: 36,
    UP: 38,
    DOWN: 40,
};

const Themes = {
    'default': `${BLOCK}_theme_default`,
    'small': `${BLOCK}_theme_small`,
    'checkout': `${BLOCK}_theme_checkout`,
};

// ------------------------------ END CONSTANTS -------------------------------

class Select {
  
    /**
     * Create a select
     * 
     * @param {JQuery} $origin The original <select> element to replace
     */
    constructor($origin, { theme = 'default' } = {}) {
        const id = $origin.attr('id');
        const labelledBy = $origin.attr('aria-labelledby');
        
        const themeClass = (theme && (theme in Themes))
            ? Themes[theme]
            : Themes['default'];

        // Create the root node
        const $root = $('<div>').addClass(`${BLOCK} ${themeClass}`);

        // Wrap original <select> into the root node and then hide
        $origin.before($root).detach();
        $root
            .append($origin)
            .addClass($origin.attr('class'));
        $origin
            .attr('tabindex', -1)
            .removeClass()
            .addClass(ClassNames.ORIGIN)
            .removeAttr('id');

        // Create the button
        const $button = $('<button></button>', {
            id,
            type: 'button',
            'aria-haspopup': 'listbox',
            'aria-labelledby': labelledBy,
            'aria-expanded': 'false',
        }).addClass(ClassNames.BUTTON).appendTo($root);
        
        // Create the options list
        const $list = $('<ul></ul>', {
            tabindex: -1,
            role: 'listbox',
            'aria-labelledby': labelledBy,
            'aria-orientation': 'horizontal',
        }).addClass(ClassNames.LIST).appendTo($root);

        this._elements = {
            $root,
            $origin,
            $button,
            $list,
        };
        
        this._state = {
            expanded: false,
            selectedIndex: -1,
            highlightedIndex: -1,
            searchString: '',

            popper: new Popper($button.get(0), $list.get(0), {
                placement: 'bottom-start'
            }),
        };

        this.update();
        
        this._handleOptionClick = this._handleOptionClick.bind(this);
        this._handleButtonClick = this._handleButtonClick.bind(this);
        this._handleOutsideClick = this._handleOutsideClick.bind(this);
        this._handleListKeyDown = this._handleListKeyDown.bind(this);
        this._handleKeyPress = this._handleKeyPress.bind(this);
        this._handleOptionMouseOver = this._handleOptionMouseOver.bind(this);

        $root.keypress(this._handleKeyPress);
        $list.keydown(this._handleListKeyDown);
        $list.on({
            mouseover: this._handleOptionMouseOver,
            click: this._handleOptionClick
        }, Selectors.OPTION);
        $button.click(this._handleButtonClick);
    }

    // ------------------------- BEGIN PRIVATE METHODS ------------------------

    /**
     * Update the list scroll position to show the highlighted option.
     */
    _scrollToHighlighted() {
        const { $list, $options } = this._elements;
        const { highlightedIndex } = this._state;

        if  (highlightedIndex !== -1) {
            const offsetTop = $options.eq(highlightedIndex).position().top;
            const offsetBottom = offsetTop + 
                $options.eq(highlightedIndex).outerHeight();
            const scrollTop = $list.scrollTop();
            const listHeight = $list.innerHeight();

            if (offsetTop < 0) {
                $list.scrollTop(scrollTop + offsetTop);
            } else if (offsetBottom > listHeight) {
                $list.scrollTop(scrollTop + (offsetBottom - listHeight));
            }
        }
    }
  
    /**
     * Highlight the specified option
     * 
     * @param {number} i Index of the option to highlight
     */
    _highlightOption(i) {
        const { $options } = this._elements;
        const { highlightedIndex } = this._state;
        
        if (highlightedIndex === i) {
            return;
        }
        
        $options.eq(highlightedIndex)
            .removeClass(ClassNames.OPTION_HIGHLIGHTED);
        
        $options.eq(i).addClass(ClassNames.OPTION_HIGHLIGHTED);
        
        this._state.highlightedIndex = i;
        
        this._scrollToHighlighted();
    }

    /**
     * Search the next option starting with the given substring
     * 
     * @param {string} str The search string
     */
    _findOption(str) {
        const { selectedIndex } = this._state;
        const { $options } = this._elements;

        if (selectedIndex === -1) {
            for (let i = 0; i < $options.length; i++) {
                if ($($options[i]).text().startsWith(str)) {
                    return i;
                }
            }
        } else {
            for (let i = selectedIndex; i < $options.length; i++) {
                if ($($options[i]).text().startsWith(str)) {
                    return i;
                }
            }

            for (let i = 0; (i < selectedIndex) && (i < $options.length); i++) {
                if ($($options[i]).text().startsWith(str)) {
                    return i;
                }
            }
        }

        return -1;
    }

    /**
     * Search options
     * 
     * @param {string} c The next character to search
     */
    _search(c) {
        const { searchString, expanded } = this._state;
        let nextIndex = null;

        if (~(nextIndex = this._findOption(searchString + c))) {
            this._state.searchString += c;
        } else if (~(nextIndex = this._findOption(c))) {
            this._state.searchString = c;
        } else {
            this._state.searchString = '';
            return;
        }

        this.selectOption(nextIndex);
        if (expanded) {
            this._highlightOption(nextIndex);
        }
    }

    // -------------------------- END PRIVATE METHODS -------------------------

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    /**
     * Handle the keypress event
     * 
     * @param {JQuery} e The dispatched event
     */
    _handleKeyPress(e) {
        this._search(String.fromCharCode(e.which));
        return false;
    }

    /**
     * Handle the option mouseover event
     * 
     * @param {jQuery.Event} e The event object
     */
    _handleOptionMouseOver(e) {
        const { $options } = this._elements;
        
        const $highlightedOption = $(e.currentTarget);
        
        const newIndex = $options.index($highlightedOption);
        if (newIndex === -1) {
            return;
        }
        
        const { highlightedIndex } = this._state;
        
        $options.eq(highlightedIndex)
            .removeClass(ClassNames.OPTION_HIGHLIGHTED);

        $options.eq(newIndex).addClass(ClassNames.OPTION_HIGHLIGHTED);
        
        this._state.highlightedIndex = newIndex;
    }
  
    /**
     * Handle the option click event
     * 
     * @param {jQuery.Event} e The event object
     */
    _handleOptionClick(e) {
        const { $options, $button } = this._elements;
        
        const $selectedOption = $(e.currentTarget);
        const newIndex = $options.index($selectedOption);
        
        this.selectOption(newIndex);

        this.collapse();
        $button.focus();
    }
  
    /**
     * Handle the button click event
     * 
     * @param {jQuery.Event} e The event object
     */
    _handleButtonClick() {
        if (!this._state.expanded) {
            this.expand();
        } else {
            this.collapse();
        }
    }
  
    /**
     * Handle the click event outside expanded option list
     * 
     * @param {jQuery.Event} e The event object
     */
    _handleOutsideClick(e) {
        const { $root } = this._elements;

        if (!$.contains($root.get(0), e.target)) {
            this.collapse();
        }
    }

    /**
     * Handle the options list keydown event
     * 
     * @param {jQuery.Event} e The event object
     */
    _handleListKeyDown(e) {
        const { which } = e;
        const { $button, $options } = this._elements;
        const { highlightedIndex } = this._state;

        switch (which) {
        case Keys.TAB:
            this.collapse();
            break;
            
        case Keys.ENTER:
            this.selectOption(highlightedIndex);
            this.collapse();
            $button.focus();
            return false;
            
        case Keys.ESC:
            this.collapse();
            $button.focus();
            return false;
            
        case Keys.UP:
            if (highlightedIndex > 0) {
                this._highlightOption(highlightedIndex - 1);
                this.selectOption(highlightedIndex - 1);
            }
            return false;
            
        case Keys.DOWN:
            if (highlightedIndex < $options.length - 1) {
                this._highlightOption(highlightedIndex + 1);
                this.selectOption(highlightedIndex + 1);
            }
            return false;
            
        case Keys.HOME:
            this._highlightOption(0);
            this.selectOption(0);
            return false;
            
        case Keys.END:
            this._highlightOption($options.length - 1);
            this.selectOption($options.length - 1);
            return false;
        }
    }

    // --------------------------- END EVENT HANDLERS -------------------------

    // -------------------------- BEGIN PUBLIC METHODS ------------------------

    /**
     * Select the given option
     * 
     * @param {number} i Index of the option to be selected
     */
    selectOption(i) {
        const { $origin, $options, $list, $button } = this._elements;
        const { selectedIndex } = this._state;
        
        if ((i < 0) || (i > $options.length) || (i === selectedIndex)) {
            return;
        }
        
        $options.eq(selectedIndex).removeAttr('aria-selected');
        
        $options.eq(i).attr('aria-selected', 'true');
        $list.attr('aria-activedescendant', $options.eq(i).attr('id'));
        $button.text($options.eq(i).text());
        $origin.val($options.eq(i).data('value')).change();
        
        this._state.selectedIndex = i;
    }

    /**
     * Update options list.
     * Call this method after you added/removed options manually.
     */
    update() {
        const { $button, $origin, $list } = this._elements;

        $list.empty();

        const selectedIndex = $origin.prop('selectedIndex');
        
        $('option', $origin).each(function(i) {
            const $originalOption = $(this);

            const optionId = $originalOption.attr('id');

            const $option = $('<li></li>', {
                id: optionId,
                role: 'option',
            })
                .text($originalOption.text())
                .data('value', $originalOption.val())
                .addClass(ClassNames.OPTION);

            if (selectedIndex === i) {
                $option.attr('aria-selected', 'true');
                $list.attr('aria-activedescendant', optionId);
                $button.text($originalOption.text());
            }

            $option.appendTo($list);

            return $option;
        });

        this._elements.$options = $('li', $list);
        
        this._state.selectedIndex = selectedIndex;
        this._state.popper.update();
    }
  
    /**
     * Collapse the options list.
     */
    collapse() {
        const { $button, $list, $options } = this._elements;
        const { highlightedIndex, expanded } = this._state;
        
        if (!expanded) {
            return;
        }

        $list.removeClass(ClassNames.LIST_EXPANDED);
        $button.attr('aria-expanded', 'false');
        
        if (highlightedIndex !== -1) {
            $options.eq(highlightedIndex)
                .removeClass(ClassNames.OPTION_HIGHLIGHTED);
            this._state.highlightedIndex = -1;
        }
        
        this._state.expanded = false;
        
        $(document).off('click', this._handleOutsideClick);
    }
  
    /**
     * Expand the options list.
     */
    expand() {
        const { $button, $list, $options } = this._elements;
        const { selectedIndex, expanded } = this._state;
        
        if (expanded) {
            return;
        }

        $list.addClass(ClassNames.LIST_EXPANDED);

        $button.attr('aria-expanded', 'true');
        $list.scrollTop(0);

        if (selectedIndex !== -1) {
            $options.eq(selectedIndex).addClass(ClassNames.OPTION_HIGHLIGHTED);
            this._state.highlightedIndex = selectedIndex;
        }
        
        this._scrollToHighlighted();
        
        this._state.expanded = true;
        
        this._state.popper.update();
        $list.focus();

        $(document).on('click', this._handleOutsideClick);
    }

    /**
     * Set the invalid modifier.
     * 
     * @param {boolean} error true if the select's value is invalid
     */
    setError(error) {
        this._elements.$root.toggleClass(ClassNames.ERROR, error);
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

export default Select;
