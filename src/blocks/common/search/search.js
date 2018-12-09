/**
 * @file Implementation of the search block
 * @author Andrey Glotov
 */

import {Toggleable} from '../../../js/utils';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the search module.
 * @return true;
 */
export const initModule = function() {
    const $search = $('.search');
    const $toggle = $('.search__toggle', $search);
    const $popup  = $('.search__popup', $search);
    const $close  = $('.search__close', $popup);

    const popupToggleable = new Toggleable(null, $toggle, $popup, {
        hoverToggles : false,
        trapFocus    : true,
        escapeHides  : true,
        onToggle     : function(open) {
            $popup
                .toggleClass('search__popup_visible', open)
                .attr('aria-hidden', String(!open));
        },
    });

    $close.click(function() {
        popupToggleable.hide();
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
