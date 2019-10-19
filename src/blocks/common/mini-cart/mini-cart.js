/**
 * Implementation of the mini cart block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'mini-cart';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    TRIGGER: `.${BLOCK}__trigger`,
    DRAWER: `.${BLOCK}__drawer`,
};

// Element class names
const CLASSES = {
    DRAWER_EXPANDED: `${BLOCK}__drawer_expanded`,
};

// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the mini cart block
 */
function initBlock() {
    const $minicart = $(SELECTORS.BLOCK);
    const $trigger = $(SELECTORS.TRIGGER, $minicart);
    const $drawer = $(SELECTORS.DRAWER, $minicart);

    const dropdown = new DropdownStrategy({
        $root: $minicart,
        $trigger,
        $drawer,

        onExpand() {
            $drawer.addClass(CLASSES.DRAWER_EXPANDED);
        },
        onCollapse() {
            $drawer.removeClass(CLASSES.DRAWER_EXPANDED);
        }
    });

    dropdown.activate();
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();
