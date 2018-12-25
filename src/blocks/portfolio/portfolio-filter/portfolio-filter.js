/**
 * @file Implementation of the portfolio filter block
 * @author Andrey Glotov
 */

import {makeListbox, makeDropdown} from '../../../js/utils';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const MEDIUM_BREAKPOINT   = 768;
const KEY_ENTER           = 13;

let $portfolio, $filter, $inner, $toggle, $list, $btns;

let verticalLayout = true;
let activeFilter   = null;

let dropdownLogic, listboxLogic;
// --------------------------- END MODULE VARIABLES ---------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------
const showList = function() {
    $toggle
        .attr('aria-expanded', 'true')
        .focusin(onToggleFocusin);

    $list
        .addClass('portfolio-filter__list_visible')
        .click(onListClick)
        .keydown(onListKeydown)
        .focus();
};

const hideList = function() {
    $list
        .removeClass('portfolio-filter__list_visible')
        .off({
            click   : onListClick,
            keydown : onListKeydown,
        });

    $toggle
        .attr('aria-expanded', 'false')
        .off('focusin', onToggleFocusin);
};
// ------------------------------ END DOM METHODS -----------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const onFilterSelect = function(next, prev) {
    const $prevBtn = $btns.eq(prev);
    const $nextBtn = $btns.eq(next);

    $prevBtn
        .removeClass('portfolio-filter__btn_active')
        .attr('aria-selected', 'false');
    $nextBtn
        .addClass('portfolio-filter__btn_active')
        .attr('aria-selected', 'true');

    activeFilter = $nextBtn.data('filter');

    $list.attr('aria-activedescendant', $nextBtn.attr('id'));

    $portfolio.trigger('filter', activeFilter);
};

const onChangeFilter = function(event, newFilter) {
    if (activeFilter !== newFilter) {
        const sel = `.portfolio-filter__btn[data-filter="${newFilter}"]`;
        listboxLogic.selectItem($btns.index($(sel)));
    }
};

const onListClick = function() {
    $toggle.focus();
};

const onListKeydown = function(event) {
    if (event.which === KEY_ENTER) {
        $toggle.focus();
        return false;
    }
};

const onToggleFocusin = function() {
    dropdownLogic.hide();
};

const onDropdownToggle = function(open) {
    if (open) {
        showList();
    } else {
        hideList();
    }
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the portfolio filter module.
 * @return true;
 */
export const initModule = function() {
    $filter    = $('.portfolio-filter');
    $inner     = $filter.find('.portfolio-filter__inner');
    $portfolio = $filter.closest('.portfolio');
    $toggle    = $inner.find('.portfolio-filter__toggle');
    $list      = $inner.find('.portfolio-filter__list');
    $btns      = $list.find('.portfolio-filter__btn');
        
    const $activeBtn = $btns.filter('.portfolio-filter__btn_active');
    activeFilter     = $activeBtn.data('filter');

    listboxLogic = makeListbox($list, $btns, {
        orientation : 'vertical',
        onSelect    : onFilterSelect,
    });

    dropdownLogic = makeDropdown($inner, $toggle, {
        onToggle: onDropdownToggle,
    });

    $portfolio.on('filter', onChangeFilter);

    return true;
};

/**
 * Respond to window resize event.
 */
export const handleResize = function() {
    const screenWidth = $(window).outerWidth();
    
    // Switch listbox orientation to vertical on mobile and to horizontal on
    // larger screens.
    if (!verticalLayout && (screenWidth < MEDIUM_BREAKPOINT)) {
        verticalLayout = true;

        $list.attr('aria-orientation', 'vertical');
        listboxLogic.setOrientation('vertical');
        dropdownLogic.unpause();
    } else if (verticalLayout && (screenWidth >= MEDIUM_BREAKPOINT)) {
        verticalLayout = false;

        $list.attr('aria-orientation', 'horizontal');
        listboxLogic.setOrientation('horizontal');
        dropdownLogic.hide().pause();
    }
};
// ---------------------------- END PUBLIC METHODS ----------------------------
