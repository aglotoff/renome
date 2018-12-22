/**
 * @file Implementation of the tabs block
 * @author Andrey Glotov
 */

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const TRANSITION_DURATION = 250;
const MEDIUM_BREAKPOINT   = 768;

const KEY_END   = 35;
const KEY_HOME  = 36;
const KEY_LEFT  = 37;
const KEY_UP    = 38;
const KEY_RIGHT = 39;
const KEY_DOWN  = 40;

let verticalLayout = false;

let $tabs, $tabLists;
// --------------------------- END MODULE VARIABLES ---------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
const tabsProto = {
    _onKeydown(event) {
        const key = event.which;

        const keyActions = verticalLayout
            ? verticalKeyActions
            : horizontalKeyActions;
        
        if (keyActions[key]) {
            keyActions[key].call(this);
            return false;
        }
    },

    firstTab() {
        this.showTab(0);
    },

    lastTab() {
        this.showTab(this._$links.length - 1);
    },

    prevTab() {
        let nextIndex = this._activeIndex - 1;
        if (nextIndex < 0) {
            nextIndex = this._$links.length - 1;
        }

        this.showTab(nextIndex);
    },

    nextTab() {
        let nextIndex = this._activeIndex + 1;
        if (nextIndex >= this._$links.length) {
            nextIndex = 0;
        }

        this.showTab(nextIndex);
    },

    showTab(nextIndex) {
        if (this._activeIndex === nextIndex) {
            return;
        }

        if (this._inProgress) {
            return;
        }
        this._inProgress = true;

        const $prevLink  = this._$links.eq(this._activeIndex);
        const $prevPanel = this._$panels.eq(this._activeIndex);
        const $nextLink  = this._$links.eq(nextIndex);
        const $nextPanel = this._$panels.eq(nextIndex);

        this._activeIndex = nextIndex;

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

        this._switchTimer = setTimeout(() => {
            $prevPanel
                .removeClass('tabs__panel_fade')
                .removeClass('tabs__panel_active');
            $nextPanel
                .removeClass('tabs__panel_fade')
                .addClass('tabs__panel_active');

            this._inProgress = false;
        }, TRANSITION_DURATION);
    }
};

const verticalKeyActions   = {
    [KEY_END]   : tabsProto.lastTab,
    [KEY_HOME]  : tabsProto.firstTab,
    [KEY_UP]    : tabsProto.prevTab,
    [KEY_DOWN]  : tabsProto.nextTab,
};
const horizontalKeyActions = {
    [KEY_END]   : tabsProto.lastTab,
    [KEY_HOME]  : tabsProto.firstTab,
    [KEY_LEFT]  : tabsProto.prevTab,
    [KEY_RIGHT] : tabsProto.nextTab,
};

/**
 * Initialize the tabs module.
 * @return true
 */
export const initModule = function() {
    $tabs     = $('.tabs');
    $tabLists = $tabs.find('.tabs__list');

    $tabs.each(function() {
        const $container = $(this);
        const $list      = $container.find('.tabs__list');
        const $links     = $list.find('.tabs__link');
        const $panels    = $container.find('.tabs__panel');

        const tabs = Object.create(tabsProto);

        tabs._$links      = $links;
        tabs._$panels     = $panels;
        tabs._activeIndex = 0;
        tabs._inProgress  = false;
        tabs._isVertical  = true;

        $list.keydown(tabs._onKeydown.bind(tabs));
        $links.each(function(i) {
            $(this).click(function onTabClick(event) {
                event.preventDefault();

                tabs.showTab(i);
            });
        });
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

        $tabLists.attr('aria-orientation', 'vertical');
    } else if (verticalLayout && (screenWidth >= MEDIUM_BREAKPOINT)) {
        verticalLayout = false;

        $tabLists.attr('aria-orientation', 'horizontal');
    }
};
// ---------------------------- END PUBLIC METHODS ----------------------------
