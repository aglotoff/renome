/**
 * Implementation of the mini cart block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the mini cart block.
 * @return true
 */
export function initBlock() {
    const $minicart = $('.mini-cart');
    const $trigger = $('.mini-cart__trigger', $minicart);
    const $drawer = $('.mini-cart__drawer', $minicart);

    const minicart = new DropdownStrategy({
        $root: $minicart,
        $trigger,
        $drawer,

        onExpand() {
            $drawer.addClass('mini-cart__drawer_expanded');
        },
        onCollapse() {
            $drawer.removeClass('mini-cart__drawer_expanded');
        }
    });
    minicart.activate();

    return true;
}

// ---------------------------- END PUBLIC METHODS ----------------------------
