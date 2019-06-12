/**
 * Implementation of the share block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/utils/dropdown-strategy';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

class Share extends DropdownStrategy {
    collapse() {
        super.collapse();

        this._elements.$drawer.removeClass('share__drawer_expanded');
    }

    expand() {
        super.expand();

        this._elements.$drawer.addClass('share__drawer_expanded');
    }
}

/**
 * Initialize the share block.
 * @return true
 */
function initBlock() {
    const $root = $('.share');
    const $trigger = $('.share__trigger', $root);
    const $drawer = $('.share__drawer', $root);

    const share = new Share($root, $trigger, $drawer);
    share.activate();

    return true;
}

// ---------------------------- END PUBLIC METHODS ----------------------------

export default {
    initBlock,
};
