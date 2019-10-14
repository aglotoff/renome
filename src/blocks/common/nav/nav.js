/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/util/dropdown-strategy';
import DrilldownStrategy from '../../../js/util/drilldown-strategy';

import { debounce, getEmSize } from '../../../js/util/index';

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
        this._elements = {
            $root,
            $parentLink: $root.prev('.nav__link'),
            $parentItem: $root.closest('.nav__item'),
            $scrollpane: $('.nav__scrollpane', $root).first(),
            $backLink: $('.nav__link_back', $root).first(),
            $firstLink: $('.nav__link', $root).not('.nav__link_back').first(),
        };

        this.drilldownStrategy = new DrilldownStrategy({
            $trigger: this._elements.$parentLink,
            $drawer: this._elements.$root,
            $initialFocus:  this._elements.$firstLink,

            onCollapse: this.collapse.bind(this), 
            onExpand: this.expand.bind(this),
        });

        this.dropdownStrategy = new DropdownStrategy({
            $root: this._elements.$parentItem,
            $trigger: this._elements.$parentLink,
            $drawer: this._elements.$root,

            onCollapse: this.collapse.bind(this), 
            onExpand: this.expand.bind(this),
        });

        // Mobile by default
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

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const DESKTOP_BREAKPOINT = 62;  // Minimum desktop screen width (in ems)
const RESIZE_INTERVAL = 200;
const SCROLL_BUFFER = 6.25;  // Offset from window top to scroll target
const SCROLL_SPEED = 1000;

const $nav = $('.nav');
const $menuToggle = $('.nav__toggle', $nav);
const $menu = $('.nav__menu', $nav);
const $scrollpane = $('.nav__scrollpane', $nav);

const mobileMenu = new DrilldownStrategy({
    $trigger: $menuToggle,
    $drawer: $nav,

    onCollapse() {
        $menu.removeClass('nav__menu_visible');
        $menuToggle.removeClass('hamburger_open');

        $('.page').removeClass('page_menu-expanded');
    },

    onExpand() {
        $menu.addClass('nav__menu_visible');
        $scrollpane.scrollTop(0);
        $menuToggle.addClass('hamburger_open');

        $('.page').addClass('page_menu-expanded');
    },
});

const submenus = $('.nav__submenu', $nav)
    .map(function() {
        return new NavSubmenu($(this));
    })
    .toArray();

let isDesktop = false;

// --------------------------- END MODULE VARIABLES ---------------------------

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

mobileMenu.activate();

$nav.on('click', '.nav__link[href^="#"]', handleInternalLinkClick);

$(window).resize(debounce(handleWindowResize, RESIZE_INTERVAL));

handleWindowResize();
