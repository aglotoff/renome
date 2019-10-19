/**
 * Implementation of the share dropdown menu block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'share';

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

// -------------------------- BEGIN PRIVATE METHODS ---------------------------

/**
 * Initialize the share dropdown menu block.
 */
function initBlock() {
    const $share = $(SELECTORS.BLOCK);
    if ($share.length === 0) {
        return;
    }

    const $trigger = $(SELECTORS.TRIGGER, $share);
    const $drawer = $(SELECTORS.DRAWER, $share);

    const dropdown = new DropdownStrategy({
        $root: $share,
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

// --------------------------- END PRIVATE METHODS ----------------------------

initBlock();
