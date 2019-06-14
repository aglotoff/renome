/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import DropdownStrategy from '../../../js/utils/dropdown-strategy';
import DrilldownStrategy from '../../../js/utils/drilldown-strategy';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const DESKTOP_BREAKPOINT = 992;  // Minimum desktop screen width

const SCROLL_BUFFER = 100;  // Offset from top to scroll target
const SCROLL_SPEED = 1000;

let $submenus;
let mobileMenu;

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
        $submenus.each(function() {
            $(this).data('drilldownStrategy').collapse();
        });
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

// --------------------------- BEGIN PRIVATE METHODS --------------------------

/**
 * Initialize submenus.
 * 
 * Each submenu has two behavior strategies: drilldown menu for smaller screens
 * and dropdown menu for larger screens.
 * 
 * @param {JQuery} $submenu The submenu elements
 */
function initSubmenu($submenu) {
    const $submenuToggle = $submenu.prev('.nav__link');
    const $parentItem  = $submenu.closest('.nav__item');
    const $scrollpane = $('.nav__scrollpane', $submenu).first();
    const $backLink = $('.nav__link_back', $submenu).first();
    const $firstLink = $('.nav__link', $submenu)
        .not('.nav__link_back')
        .first();

    const collapse = () => {
        $submenu.removeClass('nav__submenu_visible');
    };

    const expand = () => {
        $scrollpane.scrollTop(0);
        $submenu.addClass('nav__submenu_visible');
    };

    const drilldownStrategy = new DrilldownStrategy(
        $submenuToggle,
        $submenu,
        $firstLink,
        { on: { collapse, expand } }
    );
    drilldownStrategy.activate();
    $backLink.click(() => drilldownStrategy.collapse());

    const dropdownStrategy = new DropdownStrategy(
        $parentItem,
        $submenuToggle,
        $submenu,
        { on: { collapse, expand } }
    );

    $submenu.data({ dropdownStrategy, drilldownStrategy });
}

// ---------------------------- END PRIVATE METHODS ---------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------

/**
 * Initialize the navigation block.
 * @return true
 */
export const initModule = function() {
    const $nav = $('.nav');
    const $menuToggle = $('.nav__toggle', $nav);
    const $menu = $('.nav__menu', $nav);
    const $scrollpane = $('.nav__scrollpane', $nav);

    $submenus = $('.nav__submenu', $nav);

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

    $submenus.each(function() {
        initSubmenu($(this));
    });

    $nav.on('click', '.nav__link[href^="#"]', handleInternalLinkClick);
};

/**
 * Respond to window resize event.
 */
export const handleResize = function() {
    // Switch between drilldown submenus on mobile and dropdown submenus on
    // desktop
    if (isDesktop && ($(window).outerWidth() < DESKTOP_BREAKPOINT)) {
        isDesktop = false;

        $submenus.each(function() {
            $(this).data('dropdownStrategy').deactivate();
            $(this).data('drilldownStrategy').activate();
        });
    } else if (!isDesktop && ($(window).outerWidth() >= DESKTOP_BREAKPOINT)) {
        isDesktop = true;

        $submenus.each(function() {
            $(this).data('drilldownStrategy').deactivate();
            $(this).data('dropdownStrategy').activate();
        });

        mobileMenu.collapse();
    }
};

// ----------------------------- END PUBLIC METHODS ---------------------------
