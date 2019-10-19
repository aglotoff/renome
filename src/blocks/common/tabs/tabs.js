/**
 * @file Implementation of the tabs block
 * @author Andrey Glotov
 */

import { debounce, forceReflow, getEmSize } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'tabs';

// Element selectors
const SELECTOR = {
    BLOCK: `.${BLOCK}`,
    TABLIST: `.${BLOCK}__list`,
    TABS: `.${BLOCK}__tab`,
    PANELS: `.${BLOCK}__panel`,
};

// Element class names
const CLASSES = {
    PANEL_ACTIVE: `${BLOCK}__panel_active`,
    PANEL_HIDDEN: `${BLOCK}__panel_hidden`,
};
  
// Key codes  
const KEYS = {
    ENTER: 13,
    SPACE: 32,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
};

const TRANSITION_DURATION = 200;    // Fade transition duration (in ms)
const MOBILE_BREAKPOINT = 48;       // Mobile breakpoint in ems
const RESIZE_INTERVAL = 200;        // Resize debouncing interval

let isMobile = true;    // Is mobile layout active?
const tabs = [];        // All tab panels on the page

// --------------------------- END MODULE VARIABLES ---------------------------

/**
 * Tab Panel Implementation
 */
class Tabs {

    /**
     * Create tabs.
     * 
     * @param {JQuery} $root The root element
     */
    constructor($root) {
        const $list = $(SELECTOR.TABLIST, $root);
        const $tabs = $(SELECTOR.TABS, $list);
        const $panels = $(SELECTOR.PANELS, $root);

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
            $(this).toggleClass(CLASSES.PANEL_ACTIVE, i === activeIndex);
        });

        this.elements = {
            $root,
            $list,
            $tabs,
            $panels,
        };
    
        this.state = {
            activeIndex,
            isTransitioning: false,
            orientation: 'vertical',
        };

        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleTabKeyDown = this.handleTabKeyDown.bind(this);

        $list.on('click', SELECTOR.TABS, this.handleTabClick);
        $list.on('keydown', SELECTOR.TABS, this.handleTabKeyDown);

        // Keep track of all tab panels to use a single window resize
        // event handler for them all
        tabs.push(this);
    }
    
    // --------------------------- BEGIN EVENT HANDLERS --------------------------
    
    /**
     * Handle the tab click event
     * 
     * @param {JQuery.Event} e The event object
     */
    handleTabClick(e) {
        const tabIndex = this.elements.$tabs.index($(e.currentTarget));
        this.showTab(tabIndex);
        return false;
    }
  
    /**
     * Handle the tab keydown event
     * 
     * @param {JQuery.Event} e The event object
     */
    handleTabKeyDown(e) {  
        const { $tabs } = this.elements;
        const { orientation, activeIndex } = this.state;
        const { which } = e;
      
        let nextFocus = null;

        switch (which) {
        case KEYS.END:
            // Move focus to the last tab
            nextFocus = $tabs.length - 1;
            break;
  
        case KEYS.HOME:
            // Move focus to the first tab
            nextFocus = 0;
            break;
  
        case KEYS.DOWN:
            // Move focus to the next tab (in vertical tab list)
            if (orientation === 'vertical') {
                nextFocus = ($tabs.length + activeIndex + 1) % $tabs.length;
            }
            break;
  
        case KEYS.LEFT:
            // Move focus to the previous tab (in horizontal tab list)
            if (orientation === 'horizontal') {
                nextFocus = ($tabs.length + activeIndex - 1) % $tabs.length;
            }
            break;
  
        case KEYS.UP:
            // Move focus to the previous tab (in vertical tab list)
            if (orientation === 'vertical') {
                nextFocus = ($tabs.length + activeIndex - 1) % $tabs.length;
            }
            break;
  
        case KEYS.RIGHT:
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
        const { $tabs, $panels } = this.elements;
        const { isTransitioning, activeIndex } = this.state;

        if ((i < 0) || (i >= $tabs.length)) {
            return;
        }
      
        if (isTransitioning || (activeIndex === i)) {
            return;
        }
      
        this.state.isTransitioning = true;
      
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

        $prevPanel.addClass(CLASSES.PANEL_HIDDEN);

        setTimeout(() => {
            $prevPanel
                .removeClass(CLASSES.PANEL_ACTIVE)
                .removeClass(CLASSES.PANEL_HIDDEN);
            $nextPanel
                .addClass(CLASSES.PANEL_ACTIVE)
                .addClass(CLASSES.PANEL_HIDDEN);
            
            forceReflow($nextPanel);
            
            $nextPanel.removeClass(CLASSES.PANEL_HIDDEN);
            
            this.state.activeIndex = i;
            this.state.isTransitioning = false;
        }, TRANSITION_DURATION);
    }
    
    /**
     * Change tabs orienation.
     * 
     * @param {string} orientation 'vertical' or 'horizontal'
     */
    setOrientation(orientation) {
        this.state.orientation = orientation;
        this.elements.$list.attr('aria-orientation', orientation);
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

// --------------------------- END CLASS DEFINITION --------------------------- 

// Initialize all tab blocks on the page
$(SELECTOR.BLOCK).each(function() {
    new Tabs($(this));
});

$(window).resize(debounce(Tabs.handleResize, RESIZE_INTERVAL));

// Process the initial window size
Tabs.handleResize();

export default Tabs;
