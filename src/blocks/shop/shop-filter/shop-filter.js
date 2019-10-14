/**
 * @file Implementation of the shop filter block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';

const $filter = $('.shop-filter');
if ($filter.length !== 0) {
    const $inner = $('.shop-filter__inner', $filter);
    const $toggle = $('.shop-filter__toggle', $inner);
    const $list = $('.shop-filter__list', $inner);

    const filter = new DropdownStrategy({
        $root: $inner,
        $trigger: $toggle,
        $drawer: $list,

        onExpand() {
            $list.addClass('shop-filter__list_visible');
        },
        onCollapse() {
            $list.removeClass('shop-filter__list_visible');
        }
    });
    filter.activate();
}
