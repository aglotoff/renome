/**
 * Implementation of the mini cart block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/utils/dropdown-strategy';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

class MiniCart extends DropdownStrategy {
    collapse() {
        super.collapse();

        this._elements.$drawer.removeClass('mini-cart__drawer_expanded');
    }

    expand() {
        super.expand();

        this._elements.$drawer.addClass('mini-cart__drawer_expanded');
    }
}

/**
 * Initialize the mini cart block.
 * @return true
 */
function initBlock() {
    const $root = $('.mini-cart');
    const $trigger = $('.mini-cart__trigger', $root);
    const $drawer = $('.mini-cart__drawer', $root);

    const minicart = new MiniCart($root, $trigger, $drawer);
    minicart.activate();

    return true;
}

// ---------------------------- END PUBLIC METHODS ----------------------------

export default {
    initBlock,
};
