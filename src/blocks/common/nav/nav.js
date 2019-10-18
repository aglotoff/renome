/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';
import DrilldownStrategy from '../../../js/util/drilldown-strategy';

import { debounce, getEmSize } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// Block name
const BLOCK = 'nav';

// Element selectors
const SELECTORS = {
    BLOCK: `.${BLOCK}`,
    TOGGLE: `.${BLOCK}__toggle`,
    MENU: `.${BLOCK}__menu`,
    SUBMENU: `.${BLOCK}__submenu`,
    ITEM: `.${BLOCK}__item`,
    LINK: `.${BLOCK}__link`,
    INTERNAL_LINK: `.${BLOCK}__link[href^="#"]`,
    LINK_BACK: `.${BLOCK}__link_back`,
    SCROLLPANE: `.${BLOCK}__scrollpane`,
    PAGE: '.page',
};

// Element class names
const CLASSES = {
    MENU_VISIBLE: `${BLOCK}__menu_visible`,
    SUBMENU_VISIBLE: `${BLOCK}__submenu_visible`,
    PAGE_MENU_EXPANDED: 'page_menu-expanded',
    HAMBURGER_OPEN: 'hamburger_open',
};

const DESKTOP_BREAKPOINT = 62;  // Minimum desktop screen width (in ems)
const RESIZE_INTERVAL = 200;    // Resize event debounce interval (in ms)
const SCROLL_BUFFER = 6.25;     // Offset from window top to scroll target
const SCROLL_SPEED = 1000;      // Scroll speed (in ms)

// List of submenu objects
let submenus = [];

// Mobile menu dropdown
let mobileMenu;

// Is the desktop menu active?
let isDesktop = false;

// --------------------------- END MODULE VARIABLES ---------------------------

/**
 * Implementation of submenus.
 * 
 * Each submenu has two behavior strategies: drilldown menu for smaller screens
 * and dropdown menu for larger screens.
 */
class NavSubmenu {

    /**
     * Initialize submenu.
     * 
     * @param {JQuery} $root Submenu root element
     */
    constructor($root) {
        this.elements = {
            $root,
            $parentLink: $root.prev(SELECTORS.LINK),
            $parentItem: $root.closest(SELECTORS.ITEM),
            $scrollpane: $(SELECTORS.SCROLLPANE, $root).first(),
            $backLink: $(SELECTORS.LINK_BACK, $root).first(),
            $firstLink: $(SELECTORS.LINK, $root)
                .not(SELECTORS.LINK_BACK).first(),
        };

        this.drilldownStrategy = new DrilldownStrategy({
            $trigger: this.elements.$parentLink,
            $drawer: this.elements.$root,
            $initialFocus:  this.elements.$firstLink,

            onCollapse: this.collapse.bind(this), 
            onExpand: this.expand.bind(this),
        });

        this.dropdownStrategy = new DropdownStrategy({
            $root: this.elements.$parentItem,
            $trigger: this.elements.$parentLink,
            $drawer: this.elements.$root,

            onCollapse: this.collapse.bind(this), 
            onExpand: this.expand.bind(this),
        });

        // Mobile by default
        this.drilldownStrategy.activate();

        this.elements.$backLink.click(() => this.drilldownStrategy.collapse());
    }

    /**
     * Collapse the submenu
     */
    collapse() {
        this.elements.$root.removeClass(CLASSES.SUBMENU_VISIBLE);
    }

    /**
     * Expand the submenu
     */
    expand() {
        const { $root, $scrollpane } = this.elements;

        $scrollpane.scrollTop(0);   // Reset submenu scroll position
        $root.addClass(CLASSES.SUBMENU_VISIBLE);
    }

}

// -------------------------- BEGIN MODULE VARIABLES --------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------

/**
 * Scroll smoothly when navigating to internal links.
 */
function handleInternalLinkClick() {
    const $link = $(this);

    const targetId = $link.attr('href');
    const $targetElem = $(targetId);
    if ($targetElem.length === 0) {
        return;
    }

    if (!isDesktop) {
        submenus.forEach((submenu) => submenu.drilldownStrategy.collapse());
        mobileMenu.collapse();
    }

    $('html, body').animate({
        scrollTop: Math.max(
            0,
            $targetElem.offset().top - SCROLL_BUFFER * getEmSize($('.page'))
        ),
    }, SCROLL_SPEED, 'swing', function() {
        $targetElem.focus();
    });

    return false;
}

/**
 * Respond to window resize event.
 * 
 * Switch between drilldown behavior for submenus on mobile and dropdown 
 * behavior on desktop.
 */
function handleWindowResize() {
    const screenWidth = $(window).outerWidth() / getEmSize($('.page'));

    if (isDesktop && (screenWidth < DESKTOP_BREAKPOINT)) {
        isDesktop = false;

        submenus.forEach((submenu) => {
            submenu.dropdownStrategy.deactivate();
            submenu.drilldownStrategy.activate();
        });
    } else if (!isDesktop && (screenWidth >= DESKTOP_BREAKPOINT)) {
        isDesktop = true;

        submenus.forEach((submenu) => {
            submenu.drilldownStrategy.deactivate();
            submenu.dropdownStrategy.activate();
        });

        mobileMenu.collapse();
    }
}

// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize the nav menu block
 */
function initBlock() {
    const $nav = $(SELECTORS.BLOCK);
    const $menuToggle = $(SELECTORS.TOGGLE, $nav);
    const $menu = $(SELECTORS.MENU, $nav);
    const $scrollpane = $(SELECTORS.SCROLLPANE, $nav);

    mobileMenu = new DrilldownStrategy({
        $trigger: $menuToggle,
        $drawer: $nav,

        onCollapse() {
            $menu.removeClass(CLASSES.MENU_VISIBLE);
            $menuToggle.removeClass(CLASSES.HAMBURGER_OPEN);

            $(SELECTORS.PAGE).removeClass(CLASSES.PAGE_MENU_EXPANDED);
        },

        onExpand() {
            $menu.addClass(CLASSES.MENU_VISIBLE);
            $scrollpane.scrollTop(0);
            $menuToggle.addClass(CLASSES.HAMBURGER_OPEN);

            $(SELECTORS.PAGE).addClass(CLASSES.PAGE_MENU_EXPANDED);
        },
    });

    mobileMenu.activate();

    submenus = $(SELECTORS.SUBMENU, $nav)
        .map(function() {
            return new NavSubmenu($(this));
        })
        .toArray();

    $nav.on('click', SELECTORS.INTERNAL_LINK, handleInternalLinkClick);
    
    $(window).resize(debounce(handleWindowResize, RESIZE_INTERVAL));
    
    // Process the initial screen size
    handleWindowResize();
}

// ---------------------------- END PRIVATE METHODS ---------------------------

initBlock();
