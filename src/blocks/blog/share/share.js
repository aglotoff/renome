/**
 * Implementation of the share block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the share block.
 * @return true
 */
export function initBlock() {
    const $share = $('.share');
    const $trigger = $('.share__trigger', $share);
    const $drawer = $('.share__drawer', $share);

    const share = new DropdownStrategy({
        $root: $share,
        $trigger,
        $drawer,

        onExpand() {
            $drawer.addClass('share__drawer_expanded');
        },
        onCollapse() {
            $drawer.removeClass('share__drawer_expanded');
        }
    });
    share.activate();

    return true;
}

// ---------------------------- END PUBLIC METHODS ----------------------------
