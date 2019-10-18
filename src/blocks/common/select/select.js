/**
 * @file Implementation of the select block
 * @author Andrey Glotov
 */

/* global Popper */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'select';

// Element selectors
const SELECTORS = {
    OPTION: `.${BLOCK}__option`,
};

// Element class names
const CLASSES = {
    ORIGIN: `${BLOCK}__origin`,
    BUTTON: `${BLOCK}__button`,
    LIST: `${BLOCK}__list`,
    LIST_EXPANDED: `${BLOCK}__list_expanded`,
    OPTION: `${BLOCK}__option`,
    OPTION_HIGHLIGHTED: `${BLOCK}__option_highlighted`,
    ERROR: `${BLOCK}_error`,
};

// Key codes
const KEYS = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    END: 35,
    HOME: 36,
    UP: 38,
    DOWN: 40,
};

// Select block theme modifiers
const THEMES = {
    'default': `${BLOCK}_theme_default`,
    'small': `${BLOCK}_theme_small`,
    'checkout': `${BLOCK}_theme_checkout`,
};

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN CLASS DEFINITION -------------------------- 

/**
 * Collapsible dropdown select box
 */
class Select {
  
    /**
     * Create a select
     * 
     * @param {JQuery} $origin The original <select> element to replace
     */
    constructor($origin, { theme = 'default' } = {}) {
        const id = $origin.attr('id');
        const labelledBy = $origin.attr('aria-labelledby');
        
        const themeClass = (theme && (theme in THEMES))
            ? THEMES[theme]
            : THEMES['default'];

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
            .addClass(CLASSES.ORIGIN)
            .removeAttr('id');

        // Create the button
        const $button = $('<button></button>', {
            id,
            type: 'button',
            'aria-haspopup': 'listbox',
            'aria-labelledby': labelledBy,
            'aria-expanded': 'false',
        }).addClass(CLASSES.BUTTON).appendTo($root);
        
        // Create the options list
        const $list = $('<ul></ul>', {
            tabindex: -1,
            role: 'listbox',
            'aria-labelledby': labelledBy,
            'aria-orientation': 'horizontal',
        }).addClass(CLASSES.LIST).appendTo($root);

        this.elements = {
            $root,
            $origin,
            $button,
            $list,
        };
        
        this.state = {
            expanded: false,
            selectedIndex: -1,
            highlightedIndex: -1,
            searchString: '',

            popper: new Popper($button.get(0), $list.get(0), {
                placement: 'bottom-start'
            }),
        };

        this.update();
        
        this.handleOptionClick = this.handleOptionClick.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.handleListKeyDown = this.handleListKeyDown.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleOptionMouseOver = this.handleOptionMouseOver.bind(this);

        $root.keypress(this.handleKeyPress);
        $list.keydown(this.handleListKeyDown);
        $list.on({
            mouseover: this.handleOptionMouseOver,
            click: this.handleOptionClick
        }, SELECTORS.OPTION);
        $button.click(this.handleButtonClick);
    }

    // ------------------------- BEGIN PRIVATE METHODS ------------------------

    /**
     * Update the list scroll position to show the highlighted option.
     */
    scrollToHighlighted() {
        const { $list, $options } = this.elements;
        const { highlightedIndex } = this.state;

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
    highlightOption(i) {
        const { $options } = this.elements;
        const { highlightedIndex } = this.state;
        
        if (highlightedIndex === i) {
            return;
        }
        
        $options.eq(highlightedIndex)
            .removeClass(CLASSES.OPTION_HIGHLIGHTED);
        
        $options.eq(i).addClass(CLASSES.OPTION_HIGHLIGHTED);
        
        this.state.highlightedIndex = i;
        
        this.scrollToHighlighted();
    }

    /**
     * Search the next option starting with the given substring
     * 
     * @param {string} str The search string
     */
    findOption(str) {
        const { selectedIndex } = this.state;
        const { $options } = this.elements;

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
    search(c) {
        const { searchString, expanded } = this.state;
        let nextIndex = null;

        if (~(nextIndex = this.findOption(searchString + c))) {
            this.state.searchString += c;
        } else if (~(nextIndex = this._findOption(c))) {
            this.state.searchString = c;
        } else {
            this.state.searchString = '';
            return;
        }

        this.selectOption(nextIndex);
        if (expanded) {
            this.highlightOption(nextIndex);
        }
    }

    // -------------------------- END PRIVATE METHODS -------------------------

    // -------------------------- BEGIN EVENT HANDLERS ------------------------

    /**
     * Handle the keypress event
     * 
     * @param {JQuery} e The dispatched event
     */
    handleKeyPress(e) {
        this.search(String.fromCharCode(e.which));
        return false;
    }

    /**
     * Handle the option mouseover event
     * 
     * @param {jQuery.Event} e The event object
     */
    handleOptionMouseOver(e) {
        const { $options } = this.elements;
        
        const $highlightedOption = $(e.currentTarget);
        
        const newIndex = $options.index($highlightedOption);
        if (newIndex === -1) {
            return;
        }
        
        const { highlightedIndex } = this.state;
        
        $options.eq(highlightedIndex)
            .removeClass(CLASSES.OPTION_HIGHLIGHTED);

        $options.eq(newIndex).addClass(CLASSES.OPTION_HIGHLIGHTED);
        
        this.state.highlightedIndex = newIndex;
    }
  
    /**
     * Handle the option click event
     * 
     * @param {jQuery.Event} e The event object
     */
    handleOptionClick(e) {
        const { $options, $button } = this.elements;
        
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
    handleButtonClick() {
        if (!this.state.expanded) {
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
    handleOutsideClick(e) {
        const { $root } = this.elements;

        if (!$.contains($root.get(0), e.target)) {
            this.collapse();
        }
    }

    /**
     * Handle the options list keydown event
     * 
     * @param {jQuery.Event} e The event object
     */
    handleListKeyDown(e) {
        const { which } = e;
        const { $button, $options } = this.elements;
        const { highlightedIndex } = this.state;

        switch (which) {
        case KEYS.TAB:
            this.collapse();
            break;
            
        case KEYS.ENTER:
            this.selectOption(highlightedIndex);
            this.collapse();
            $button.focus();
            return false;
            
        case KEYS.ESC:
            this.collapse();
            $button.focus();
            return false;
            
        case KEYS.UP:
            if (highlightedIndex > 0) {
                this.highlightOption(highlightedIndex - 1);
                this.selectOption(highlightedIndex - 1);
            }
            return false;
            
        case KEYS.DOWN:
            if (highlightedIndex < $options.length - 1) {
                this.highlightOption(highlightedIndex + 1);
                this.selectOption(highlightedIndex + 1);
            }
            return false;
            
        case KEYS.HOME:
            this.highlightOption(0);
            this.selectOption(0);
            return false;
            
        case KEYS.END:
            this.highlightOption($options.length - 1);
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
        const { $origin, $options, $list, $button } = this.elements;
        const { selectedIndex } = this.state;
        
        if ((i < 0) || (i > $options.length) || (i === selectedIndex)) {
            return;
        }
        
        $options.eq(selectedIndex).removeAttr('aria-selected');
        
        $options.eq(i).attr('aria-selected', 'true');
        $list.attr('aria-activedescendant', $options.eq(i).attr('id'));
        $button.text($options.eq(i).text());
        $origin.val($options.eq(i).data('value')).change();
        
        this.state.selectedIndex = i;
    }

    /**
     * Update options list.
     * Call this method after you added/removed options manually.
     */
    update() {
        const { $button, $origin, $list } = this.elements;

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
                .addClass(CLASSES.OPTION);

            if (selectedIndex === i) {
                $option.attr('aria-selected', 'true');
                $list.attr('aria-activedescendant', optionId);
                $button.text($originalOption.text());
            }

            $option.appendTo($list);

            return $option;
        });

        this.elements.$options = $('li', $list);
        
        this.state.selectedIndex = selectedIndex;
        this.state.popper.update();
    }
  
    /**
     * Collapse the options list.
     */
    collapse() {
        const { $button, $list, $options } = this.elements;
        const { highlightedIndex, expanded } = this.state;
        
        if (!expanded) {
            return;
        }

        $list.removeClass(CLASSES.LIST_EXPANDED);
        $button.attr('aria-expanded', 'false');
        
        if (highlightedIndex !== -1) {
            $options.eq(highlightedIndex)
                .removeClass(CLASSES.OPTION_HIGHLIGHTED);
            this.state.highlightedIndex = -1;
        }
        
        this.state.expanded = false;
        
        $(document).off('click', this.handleOutsideClick);
    }
  
    /**
     * Expand the options list.
     */
    expand() {
        const { $button, $list, $options } = this.elements;
        const { selectedIndex, expanded } = this.state;
        
        if (expanded) {
            return;
        }

        $list.addClass(CLASSES.LIST_EXPANDED);

        $button.attr('aria-expanded', 'true');
        $list.scrollTop(0);

        if (selectedIndex !== -1) {
            $options.eq(selectedIndex).addClass(CLASSES.OPTION_HIGHLIGHTED);
            this.state.highlightedIndex = selectedIndex;
        }
        
        this.scrollToHighlighted();
        
        this.state.expanded = true;
        
        this.state.popper.update();
        $list.focus();

        $(document).on('click', this.handleOutsideClick);
    }

    /**
     * Set the invalid modifier.
     * 
     * @param {boolean} error true if the select's value is invalid
     */
    setError(error) {
        this.elements.$root.toggleClass(CLASSES.ERROR, error);
    }

    // --------------------------- END PUBLIC METHODS -------------------------
}

// --------------------------- END CLASS DEFINITION --------------------------- 

export default Select;
