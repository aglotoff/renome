/**
 * @file Implementation of the portfolio filter block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const BLOCK = 'portfolio-filter';

const ClassNames = {
    LIST_VISIBLE: `${BLOCK}__list_visible`,
    OPTION_HIGHLIGHTED: `${BLOCK}__option_highlighted`,
};

const Selectors = {
    ROOT: `.${BLOCK}`,
    INNER: `.${BLOCK}__inner`,
    TOGGLE: `.${BLOCK}__toggle`,
    LIST: `.${BLOCK}__list`,
    OPTION: `.${BLOCK}__option`,
};

const Keys = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};

const elements = {};
const config = {};

const state = {
    selectedIndex: 0,
    highlightedIndex: 0,
    isDropdown: true,
    isExpanded: false,
};

// --------------------------- END MODULE VARIABLES ---------------------------

// -------------------------- BEGIN PRIVATE METHODS ---------------------------

/**
 * Expand the option list on mobile screens
 */
function expandList() {
    const { $toggle, $list } = elements;

    $toggle.attr('aria-expanded', 'true');

    $list
        .addClass(ClassNames.LIST_VISIBLE)
        .focus();

    highlightOption(state.selectedIndex);

    state.isExpanded = true;

    $(document).on('click', handleOutsideClick);
}

/**
 * Collapse the option list on mobile screens
 */
function collapseList() {
    const { $toggle, $list } = elements;

    $list.removeClass(ClassNames.LIST_VISIBLE);

    $toggle.attr('aria-expanded', 'false');

    state.isExpanded = false;

    $(document).off('click', handleOutsideClick);
}

/**
 * Highlight the given option
 * 
 * @param {number} i Index of the option to be highlighted
 */
function highlightOption(i) {
    const { $options } = elements;
    const { highlightedIndex } = state;

    if ((i < 0) || (i > $options.length) || (i === highlightedIndex)) {
        return;
    }
    
    $options.eq(highlightedIndex).removeClass(ClassNames.OPTION_HIGHLIGHTED);
    $options.eq(i).addClass(ClassNames.OPTION_HIGHLIGHTED);

    state.highlightedIndex = i;
}

/**
 * Select the given option
 * 
 * @param {number} i Index of the option to be selected
 */
function selectOption(i) {
    const { $list, $options  } = elements;
    
    if ((i < 0) || (i > $options.length) || (i === state.selectedIndex)) {
        return;
    }
    
    $options.eq(state.selectedIndex).removeAttr('aria-selected');
    $options.eq(i).attr('aria-selected', 'true');

    $list.attr('aria-activedescendant', $options.eq(i).attr('id'));
    state.selectedIndex = i;

    highlightOption(i);

    config.onChange($options.eq(i).data('filter'));
}

// ---------------------------- END PRIVATE METHODS ---------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------

/**
 * Handle the option click event
 * 
 * @param {jQuery.Event} e The event object
 */
function handleOptionClick(e) {
    const { $toggle, $options } = elements;

    const newIndex = $options.index($(e.currentTarget));
    
    selectOption(newIndex);

    if (state.isExpanded) {
        collapseList();
        $toggle.focus();
    }
}

/**
 * Handle the toggle button click event
 */
function handleToggleClick() {
    if (!state.isExpanded) {
        expandList();
    } else {
        collapseList();
    }
}

/**
 * Handle the click event outside expanded list
 * 
 * @param {jQuery.Event} e The event object
 */
function handleOutsideClick(e) {
    const { $inner } = elements;

    if (!$.contains($inner.get(0), e.target)) {
        collapseList();
    }
}

/**
 * Handle the options list keydown event
 * 
 * @param {jQuery.Event} e The event object
 */
function handleListKeyDown(e) {
    const { which } = e;
    const { $toggle, $options } = elements;

    const { highlightedIndex, isDropdown, isExpanded } = state;

    switch (which) {
    case Keys.TAB:
        if (isExpanded) {
            collapseList();
        }
        break;

    case Keys.ENTER:
        selectOption(highlightedIndex);
        if (isExpanded) {
            collapseList();
            $toggle.focus();
        }
        return false;

    case Keys.ESC:
        if (isExpanded) {
            collapseList();
            $toggle.focus();
        }
        return false;
    
    case Keys.LEFT:
        if (!isDropdown && (highlightedIndex > 0)) {
            highlightOption(highlightedIndex - 1);
        }
        return false;

    case Keys.UP:
        if (isDropdown && (highlightedIndex > 0)) {
            highlightOption(highlightedIndex - 1);
        }
        return false;
        
    case Keys.RIGHT:
        if (!isDropdown && (highlightedIndex < $options.length - 1)) {
            highlightOption(highlightedIndex + 1);
        }
        return false;

    case Keys.DOWN:
        if (isDropdown && (highlightedIndex < $options.length - 1)) {
            highlightOption(highlightedIndex + 1);
        }
        return false;
        
    case Keys.HOME:
        highlightOption(0);
        return false;
        
    case Keys.END:
        highlightOption($options.length - 1);
        return false;
    }
}

// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the portfolio filter block.
 */
export function initBlock({ onChange }) {
    const $root = $(Selectors.ROOT);
    const $inner = $(Selectors.INNER, $root);
    const $toggle = $(Selectors.TOGGLE, $inner);
    const $list = $(Selectors.LIST, $inner);
    const $options = $(Selectors.OPTION, $list);

    config.onChange = onChange;

    elements.$inner = $inner;
    elements.$toggle = $toggle;
    elements.$list = $list;
    elements.$options = $options;

    $list.keydown(handleListKeyDown);
    $list.on('click', Selectors.OPTION, handleOptionClick);
    $toggle.click(handleToggleClick);
}

/**
 * Toggle the dropdown mode
 * 
 * @param {boolean} dropdown whether to active the dropdown mode
 */
export function setDropdownMode(dropdown) {
    if (!dropdown && state.isExpanded) {
        collapseList();
    }

    elements.$list
        .attr('aria-orientation', dropdown ? 'vertical' : 'horizontal');

    state.isDropdown = dropdown;
}

/**
 * Apply a filter.
 * 
 * @param {string} filter - The filter to be applied
 */
export function setFilter(filter) {
    const sel = `${Selectors.OPTION}[data-filter="${filter}"]`;
    selectOption(elements.$options.index($(sel)));
}

// ---------------------------- END PUBLIC METHODS ----------------------------
