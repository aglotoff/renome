/**
 * @file Implementation of the mini cart block
 * @author Andrey Glotov
 */

import {makeDropdown} from '../../../js/utils';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the mini cart module.
 * @return true
 */
export const initModule = function() {
    const $minicart = $('.mini-cart');
    const $toggle   = $minicart.find('.mini-cart__toggle');

    makeDropdown($minicart, $toggle, {
        hoverToggles : true,

        onToggle     : function onMinicartToggle(open) {
            $minicart.toggleClass('mini-cart_open', open);
            $toggle.attr('aria-expanded', String(open));
        },
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
