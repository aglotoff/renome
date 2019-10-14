/**
 * @file Implementation of the tabs block
 * @author Andrey Glotov
 */

import { debounce, forceReflow, getEmSize } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const TRANSITION_DURATION = 200;
const MOBILE_BREAKPOINT = 48;   // Mobile breakpoint in ems
const RESIZE_INTERVAL = 200;  // Resize debouncing interval

const ClassNames = {
    PANEL_ACTIVE: 'tabs__panel_active',
    PANEL_HIDDEN: 'tabs__panel_hidden',
};
  
const Selectors = {
    ROOT: '.tabs',
    TABLIST: '.tabs__list',
    TABS: '.tabs__tab',
    PANELS: '.tabs__panel',
};
  
const Keys = {
    ENTER: 13,
    SPACE: 32,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};

let isMobile = true;
const tabs = [];
// --------------------------- END MODULE VARIABLES ---------------------------

/**
 * Tabs implementation
 */
class Tabs {

    /**
     * Create tabs.
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        const $list = $(Selectors.TABLIST, $root);
        const $tabs = $(Selectors.TABS, $list);
        const $panels = $(Selectors.PANELS, $root);

        if (($tabs.length === 0) || ($tabs.length !== $panels.length)) {
            return;
        }

        let activeIndex = null;

        $tabs.each(function(i) {
            const $tab = $(this);

            if ($tab.attr('aria-selected') === 'true') {
                if (activeIndex === -1) {
                    activeIndex = i;
                } else {
                    $tab.attr('aria-selected', 'false');
                }

                $tab.attr('tabindex', '0');
            } else {
                $tab.attr('tabindex', '-1');
            }
        });
        
        if (activeIndex == null) {
            $tabs.eq(0).attr({
                'aria-selected': 'true',
                'tabindex': '0',
            });

            activeIndex = 0;
        }
        
        $panels.each(function(i) {
            $(this).toggleClass(ClassNames.PANEL_ACTIVE, i === activeIndex);
        });

        this._elements = {
            $root,
            $list,
            $tabs,
            $panels,
        };
    
        this._state = {
            activeIndex,
            isTransitioning: false,
            orientation: 'vertical',
        };

        this._handleTabClick = this._handleTabClick.bind(this);
        this._handleTabKeyDown = this._handleTabKeyDown.bind(this);

        $list.on('click', Selectors.TABS, this._handleTabClick);
        $list.on('keydown', Selectors.TABS, this._handleTabKeyDown);
    }
    
    // --------------------------- BEGIN EVENT HANDLERS --------------------------
    
    /**
     * Handle the tab click event
     * 
     * @param {JQuery.Event} e The event object
     */
    _handleTabClick(e) {
        const tabIndex = this._elements.$tabs.index($(e.currentTarget));
        this.showTab(tabIndex);
        return false;
    }
  
    /**
     * Handle the tab keydown event
     * 
     * @param {JQuery.Event} e The event object
     */
    _handleTabKeyDown(e) {  
        const { $tabs } = this._elements;
        const { orientation, activeIndex } = this._state;
        const { which } = e;
      
        let nextFocus = null;

        switch (which) {
        case Keys.END:
            // Move focus to the last tab
            nextFocus = $tabs.length - 1;
            break;
  
        case Keys.HOME:
            // Move focus to the first tab
            nextFocus = 0;
            break;
  
        case Keys.DOWN:
            // Move focus to the next tab (in vertical tab list)
            if (orientation === 'vertical') {
                nextFocus = ($tabs.length + activeIndex + 1) % $tabs.length;
            }
            break;
  
        case Keys.LEFT:
            // Move focus to the previous tab (in horizontal tab list)
            if (orientation === 'horizontal') {
                nextFocus = ($tabs.length + activeIndex - 1) % $tabs.length;
            }
            break;
  
        case Keys.UP:
            // Move focus to the previous tab (in vertical tab list)
            if (orientation === 'vertical') {
                nextFocus = ($tabs.length + activeIndex - 1) % $tabs.length;
            }
            break;
  
        case Keys.RIGHT:
            // Move focus to the next tab (in horizontal tab list)
            if (orientation === 'horizontal') {
                nextFocus = ($tabs.length + activeIndex + 1) % $tabs.length;
            }
            break;
        }

        if (nextFocus != null) {
            this.showTab(nextFocus);
            return false;
        }
    }
    
    // ---------------------------- END EVENT HANDLERS ---------------------------
    
    // --------------------------- BEGIN PUBLIC METHODS --------------------------
    
    /**
     * Activate the given tab.
     * 
     * @param {number} i index of the tab to be activated
     */
    showTab(i) {
        const { $tabs, $panels } = this._elements;
        const { isTransitioning, activeIndex } = this._state;

        if ((i < 0) || (i >= $tabs.length)) {
            return;
        }
      
        if (isTransitioning || (activeIndex === i)) {
            return;
        }
      
        this._state.isTransitioning = true;
      
        const $prevTab = $tabs.eq(activeIndex);
        const $prevPanel = $panels.eq(activeIndex);
        const $nextTab = $tabs.eq(i);
        const $nextPanel = $panels.eq(i);
      
        $prevTab.attr({
            'aria-selected': 'false',
            'tabindex': '-1',
        });
        $nextTab.attr({
            'aria-selected': 'true',
            'tabindex': '0',
        });

        $nextTab.focus();

        $prevPanel.addClass(ClassNames.PANEL_HIDDEN);

        setTimeout(() => {
            $prevPanel
                .removeClass(ClassNames.PANEL_ACTIVE)
                .removeClass(ClassNames.PANEL_HIDDEN);
            $nextPanel
                .addClass(ClassNames.PANEL_ACTIVE)
                .addClass(ClassNames.PANEL_HIDDEN);
            
            forceReflow($nextPanel);
            
            $nextPanel.removeClass(ClassNames.PANEL_HIDDEN);
            
            this._state.activeIndex = i;
            this._state.isTransitioning = false;
        }, TRANSITION_DURATION);
    }
    
    /**
     * Change tabs orienation.
     * 
     * @param {string} orientation 'vertical' or 'horizontal'
     */
    setOrientation(orientation) {
        this._state.orientation = orientation;
        this._elements.$list.attr('aria-orientation', orientation);
    }
    
    /** 
     * Initialize all tabs blocks on the page.
     */
    static initAll() {
        $(Selectors.ROOT).each(function() {
            tabs.push(new Tabs($(this)));
        });
    }

    /**
     * Respond to window resize event.
     * 
     * Switch between vertical orientation on mobile devices and horizontal
     * orientation on larger screens.
     */
    static handleResize() {
        const screenWidth = $(window).outerWidth() / getEmSize($('.page'));

        if (!isMobile && (screenWidth < MOBILE_BREAKPOINT)) {
            isMobile = true;
    
            tabs.forEach((tab) => tab.setOrientation('vertical'));
        } else if (isMobile && (screenWidth >= MOBILE_BREAKPOINT)) {
            isMobile = false;
    
            tabs.forEach((tab) => tab.setOrientation('horizontal'));
        }
    }

    // ---------------------------- END PUBLIC METHODS ---------------------------
}

Tabs.initAll();

$(window).resize(debounce(Tabs.handleResize, RESIZE_INTERVAL));

Tabs.handleResize();

export default Tabs;
