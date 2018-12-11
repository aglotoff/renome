/**
 * @file Implementation of the search block
 * @author Andrey Glotov
 */

import {makeModal} from '../../../js/utils';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the search module.
 * @return true;
 */
export const initModule = function() {
    const $search = $('.search');
    const $toggle = $('.search__toggle', $search);
    const $popup  = $('.search__popup',  $search);
    const $close  = $('.search__close',  $popup);

    const popupModal = makeModal($popup, {
        focusDelay: 100,
        onToggle(open) {
            $popup
                .toggleClass('search__popup_visible', open)
                .attr('aria-hidden', String(!open));
        },
    });

    $toggle.click(function() {
        popupModal.show();
    });
    $close.click(function() {
        popupModal.hide();
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
