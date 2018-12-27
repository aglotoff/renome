/**
 * @file Implementation of the portfolio filter block
 * @author Andrey Glotov
 */

import {makeListbox, makeDropdown} from '../../../js/utils';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const KEY_ENTER = 13;
const KEY_SPACE = 32;

let $portfolio, $filter, $inner, $toggle, $list, $btns;

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

    const activeFilter = $nextBtn.data('filter');

    $list.attr('aria-activedescendant', $nextBtn.attr('id'));

    $portfolio.trigger('filter', activeFilter);
};

const onListClick = function() {
    $toggle.focus();
};

const onListKeydown = function(event) {
    if (event.which === KEY_ENTER || event.which === KEY_SPACE) {
        event.preventDefault();

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
 * @return true
 */
export const initModule = function() {
    $portfolio = $('.portfolio');

    $filter    = $('.portfolio-filter');
    $inner     = $filter.find('.portfolio-filter__inner');
    $toggle    = $inner.find('.portfolio-filter__toggle');
    $list      = $inner.find('.portfolio-filter__list');
    $btns      = $list.find('.portfolio-filter__btn');

    listboxLogic = makeListbox($list, $btns, {
        orientation : 'vertical',
        onSelect    : onFilterSelect,
    });

    dropdownLogic = makeDropdown($inner, $toggle, {
        onToggle: onDropdownToggle,
    });

    return true;
};

/**
 * Set filter orientation.
 * @param {string} orientation - 'horizontal' or 'vertical'
 */
export const setOrientation = function(orientation) {
    $list.attr('aria-orientation', orientation);
    listboxLogic.setOrientation(orientation);

    if (orientation === 'horizontal') {
        dropdownLogic.hide().pause();
    } else {
        dropdownLogic.unpause();
    }
};

/**
 * Apply a filter.
 * @param {string} filter - The filter to be applied
 */
export const setFilter = function(filter) {
    const sel = `.portfolio-filter__btn[data-filter="${filter}"]`;
    listboxLogic.selectItem($btns.index($(sel)));
};
// ---------------------------- END PUBLIC METHODS ----------------------------
