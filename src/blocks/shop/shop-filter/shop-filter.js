/**
 * @file Implementation of the shop filter block
 * @author Andrey Glotov
 */

import {makeDropdown} from '../../../js/utils';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the shop filter module.
 * @return true if the filter block is present, false otherwise
 */
export const initModule = function() {
    const $filter = $('.shop-filter');
    if ($filter.length === 0) {
        return false;
    }

    const $inner  = $filter.find('.shop-filter__inner');
    const $toggle = $inner.find('.shop-filter__toggle');
    const $list   = $inner.find('.shop-filter__list');

    makeDropdown($inner, $toggle, {
        hoverToggles : true,

        onToggle     : function onShopFilterToggle(open) {
            $list.toggleClass('shop-filter__list_visible', open);

            if (open) {
                $toggle.attr('aria-expanded', 'true');
            } else {
                $toggle.removeAttr('aria-expanded');
            }
        },
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
