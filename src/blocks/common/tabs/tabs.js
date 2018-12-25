/**
 * @file Implementation of the tabs block
 * @author Andrey Glotov
 */

import {makeListbox} from '../../../js/utils';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const TRANSITION_DURATION = 250;
const MEDIUM_BREAKPOINT   = 768;

let verticalLayout = true;

const allTabs = [];
// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
const tabsProto = {
    _onTabSelect(next, prev) {
        const $prevLink  = this._$links.eq(prev);
        const $prevPanel = this._$panels.eq(prev);
        const $nextLink  = this._$links.eq(next);
        const $nextPanel = this._$panels.eq(next);

        $prevLink
            .removeClass('tabs__link_active')
            .attr({
                'aria-selected' : 'false',
                'tabindex'      : '-1'
            });

        $nextLink
            .addClass('tabs__link_active')
            .attr({
                'aria-selected' : 'true',
                'tabindex'      : '0'
            })
            .focus();

        $prevPanel.addClass('tabs__panel_fade');
        $nextPanel.addClass('tabs__panel_fade');

        setTimeout(() => {
            $prevPanel
                .removeClass('tabs__panel_fade')
                .removeClass('tabs__panel_active');
            $nextPanel
                .removeClass('tabs__panel_fade')
                .addClass('tabs__panel_active');
        }, TRANSITION_DURATION);
    },

    setOrientation(orientation) {
        this._$list.attr('aria-orientation', orientation);
        this._logic.setOrientation(orientation);
    },
};

/**
 * Initialize the tabs module.
 * @return true
 */
export const initModule = function() {
    $('.tabs').each(function() {
        const $container = $(this);

        const tabs = Object.create(tabsProto);

        tabs._$list    = $container.find('.tabs__list');
        tabs._$links   = tabs._$list.find('.tabs__link');
        tabs._$panels  = $container.find('.tabs__panel');

        tabs._logic    = makeListbox(tabs._$list, tabs._$links, {
            orientation : 'vertical',
            onSelect    : tabs._onTabSelect.bind(tabs),
        });

        allTabs.push(tabs);
    });

    return true;
};

/**
 * Respond to window resize event.
 */
export const handleResize = function() {
    const screenWidth = $(window).outerWidth();
    
    // Switch tabs orientation to vertical on mobile and to horizontal on
    // larger screens.
    if (!verticalLayout && (screenWidth < MEDIUM_BREAKPOINT)) {
        verticalLayout = true;

        allTabs.forEach(function(tab) {
            tab.setOrientation('vertical');
        });
    } else if (verticalLayout && (screenWidth >= MEDIUM_BREAKPOINT)) {
        verticalLayout = false;

        allTabs.forEach(function(tab) {
            tab.setOrientation('horizontal');
        });
    }
};
// ---------------------------- END PUBLIC METHODS ----------------------------
