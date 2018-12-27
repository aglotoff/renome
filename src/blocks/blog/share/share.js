/**
 * @file Implementation of the share block
 * @author Andrey Glotov
 */

import {makeDropdown} from '../../../js/utils';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the share module.
 * @return true;
 */
export const initModule = function() {
    $('.share').each(function() {
        const $share  = $(this);
        const $toggle = $share.find('.share__toggle');
        const $drop   = $share.find('.share__drop');

        makeDropdown($share, $toggle, {
            hoverToggles : true,
            onToggle     : function onShareToggle(open) {
                $drop.toggleClass('share__drop_visible', open);
                $toggle.attr('aria-expanded', String(open));
            },
        });
    });

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------