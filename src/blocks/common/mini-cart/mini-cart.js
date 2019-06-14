/**
 * Implementation of the mini cart block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/utils/dropdown-strategy';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the mini cart block.
 * @return true
 */
function initBlock() {
    const $minicart = $('.mini-cart');
    const $trigger = $('.mini-cart__trigger', $minicart);
    const $drawer = $('.mini-cart__drawer', $minicart);

    const minicart = new DropdownStrategy($minicart, $trigger, $drawer, {
        on: {
            expand() {
                $drawer.addClass('mini-cart__drawer_expanded');
            },
            collapse() {
                $drawer.removeClass('mini-cart__drawer_expanded');
            }
        }
    });
    minicart.activate();

    return true;
}

// ---------------------------- END PUBLIC METHODS ----------------------------

export default {
    initBlock,
};
