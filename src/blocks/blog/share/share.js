/**
 * Implementation of the share block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';

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
