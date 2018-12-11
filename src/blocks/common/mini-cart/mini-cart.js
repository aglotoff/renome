/**
 * @file Implementation of the mini cart block
 * @author Andrey Glotov
 */

import {makeDropdown} from '../../../js/utils';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the mini cart module.
 * @return true;
 */
export const initModule = function() {
    const $minicart = $('.mini-cart');
    const $toggle   = $('.mini-cart__toggle', $minicart);

    makeDropdown($minicart, $toggle, {
        hoverToggles : true,
        onToggle     : function(open) {
            $minicart.toggleClass('mini-cart_open', open);
        }
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
