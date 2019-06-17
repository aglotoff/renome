/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/utils/dropdown-strategy';
import DrilldownStrategy from '../../../js/utils/drilldown-strategy';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const DESKTOP_BREAKPOINT = 992;  // Minimum desktop screen width

const SCROLL_BUFFER = 100;  // Offset from window top to scroll target
const SCROLL_SPEED = 1000;

let submenus;
let mobileMenu;

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
     * Iniitalize submenu.
     * 
     * @param {JQuery} $root Submenu root element
     */
    constructor($root) {
        this._elements = {
            $root,
            $parentLink: $root.prev('.nav__link'),
            $parentItem: $root.closest('.nav__item'),
            $scrollpane: $('.nav__scrollpane', $root).first(),
            $backLink: $('.nav__link_back', $root).first(),
            $firstLink: $('.nav__link', $root).not('.nav__link_back').first(),
        };

        this.drilldownStrategy = new DrilldownStrategy(
            this._elements.$parentLink,
            this._elements.$root,
            this._elements.$firstLink,
            {
                on: { 
                    collapse: this.collapse.bind(this), 
                    expand: this.expand.bind(this),
                }
            }
        );

        this.dropdownStrategy = new DropdownStrategy(
            this._elements.$parentItem,
            this._elements.$parentLink,
            this._elements.$root,
            {
                on: { 
                    collapse: this.collapse.bind(this), 
                    expand: this.expand.bind(this),
                }
            }
        );

        this.drilldownStrategy.activate();

        this._elements.$backLink.click(() => this.drilldownStrategy.collapse());
    }

    collapse() {
        const { $root } = this._elements;

        $root.removeClass('nav__submenu_visible');
    }

    expand() {
        const { $root, $scrollpane } = this._elements;

        $scrollpane.scrollTop(0);   // Reset submenu scroll position
        $root.addClass('nav__submenu_visible');
    }
}

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
        scrollTop: Math.max(0, $targetElem.offset().top - SCROLL_BUFFER),
    }, SCROLL_SPEED, 'swing', function() {
        $targetElem.focus();
    });

    return false;
}

// ---------------------------- END EVENT HANDLERS ----------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------

/**
 * Initialize the navigation block.
 * @return true
 */
function initBlock() {
    const $nav = $('.nav');
    const $menuToggle = $('.nav__toggle', $nav);
    const $menu = $('.nav__menu', $nav);
    const $scrollpane = $('.nav__scrollpane', $nav);

    mobileMenu = new DrilldownStrategy($menuToggle, $nav, null, {
        on: {
            expand() {
                $menu.addClass('nav__menu_visible');
                $scrollpane.scrollTop(0);
                $menuToggle.addClass('hamburger_open');
            },
            collapse() {
                $menu.removeClass('nav__menu_visible');
                $menuToggle.removeClass('hamburger_open');
            }
        }
    });
    mobileMenu.activate();

    submenus = $('.nav__submenu', $nav)
        .map(function() {
            return new NavSubmenu($(this));
        })
        .toArray();

    $nav.on('click', '.nav__link[href^="#"]', handleInternalLinkClick);
}

/**
 * Respond to window resize event.
 * 
 * Switch between drilldown behavior for submenus on mobile and dropdown 
 * behavior on desktop.
 */
function handleResize() {
    if (isDesktop && ($(window).outerWidth() < DESKTOP_BREAKPOINT)) {
        isDesktop = false;

        submenus.forEach((submenu) => {
            submenu.dropdownStrategy.deactivate();
            submenu.drilldownStrategy.activate();
        });
    } else if (!isDesktop && ($(window).outerWidth() >= DESKTOP_BREAKPOINT)) {
        isDesktop = true;

        submenus.forEach((submenu) => {
            submenu.drilldownStrategy.deactivate();
            submenu.dropdownStrategy.activate();
        });

        mobileMenu.collapse();
    }
}

// ----------------------------- END PUBLIC METHODS ---------------------------

export default {
    initBlock,
    handleResize,
};
