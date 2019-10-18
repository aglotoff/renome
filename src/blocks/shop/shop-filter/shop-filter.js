/**
 * @file Implementation of the shop filter block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'shop-filter';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    INNER: `.${BLOCK}__inner`,
    TOGGLE: `.${BLOCK}__toggle`,
    LIST: `.${BLOCK}__list`,
};

// Element class names
const CLASSES = {
    LIST_VISIBLE: `${BLOCK}__list_visible`,
};

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the shop filter block.
 */
function initBlock() {
    const $filter = $(SELECTORS.BLOCK);
    if ($filter.length == 0) {
        return;
    }

    const $inner = $(SELECTORS.INNER, $filter);
    const $toggle = $(SELECTORS.TOGGLE, $inner);
    const $list = $(SELECTORS.LIST, $inner);

    const dropdown = new DropdownStrategy({
        $root: $inner,
        $trigger: $toggle,
        $drawer: $list,

        onExpand() {
            $list.addClass(CLASSES.LIST_VISIBLE);
        },
        onCollapse() {
            $list.removeClass(CLASSES.LIST_VISIBLE);
        }
    });
    dropdown.activate();
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();
