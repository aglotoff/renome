/**
 * @file Implementation of the mini cart block
 * @author Andrey Glotov
 */

import {Toggleable} from '../../../js/utils';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the mini cart module.
 * @return true;
 */
export const initModule = function() {
    const $minicart = $('.mini-cart');
    const $toggle   = $('.mini-cart__toggle', $minicart);
    const $drop     = $('.mini-cart__drop', $minicart);

    new Toggleable($minicart, $toggle, $drop, {
        onToggle: function(open) {
            $toggle.attr('aria-expanded', String(open));
            $minicart.toggleClass('mini-cart_open', open);
        },
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
