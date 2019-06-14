/**
 * Implementation of the share block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/utils/dropdown-strategy';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the share block.
 * @return true
 */
function initBlock() {
    const $share = $('.share');
    const $trigger = $('.share__trigger', $share);
    const $drawer = $('.share__drawer', $share);

    const share = new DropdownStrategy($share, $trigger, $drawer, {
        on: {
            expand() {
                $drawer.addClass('share__drawer_expanded');
            },
            collapse() {
                $drawer.removeClass('share__drawer_expanded');
            }
        }
    });
    share.activate();

    return true;
}

// ---------------------------- END PUBLIC METHODS ----------------------------

export default {
    initBlock,
};
