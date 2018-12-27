/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import {makeDropdown, makeDrilldown} from '../../../js/utils';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const DESKTOP_BREAKPOINT = 992;  // Minimum desktop screen width

let $nav, $menuToggle, $menu, $scrollpanes, $submenus;
let menuDrilldown;

let isMobile = true;
// --------------------------- END MODULE VARIABLES ---------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------
const toggleMenu = function(open) {
    $menu.toggleClass('nav__menu_visible', open);
    $scrollpanes.scrollTop(0);

    $menuToggle.toggleClass('hamburger_open', open);
    if (open) {
        $menuToggle.attr('aria-expanded', 'true');
    } else {
        $menuToggle.removeAttr('aria-expanded');
    }
};

const toggleSubmenu = function toggleSubmenu($submenu, $toggle, open) {
    $submenu.toggleClass('nav__submenu_visible', open);

    if (open) {
        $toggle.attr('aria-expanded', 'true');
    } else {
        $toggle.removeAttr('aria-expanded');
    }
};
// ------------------------------ END DOM METHODS -----------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Initialize the navigation block.
 * @return true
 */
export const initModule = function() {
    $nav         = $('.nav');
    $menuToggle  = $nav.find('.nav__toggle');
    $menu        = $nav.find('.nav__menu');
    $scrollpanes = $menu.find('.nav__scrollpane');
    $submenus    = $nav.find('.nav__submenu');

    menuDrilldown = makeDrilldown($nav, $menuToggle, {
        onToggle: toggleMenu,
    });

    // begin initialize submenus
    $submenus.each(function() {
        const $submenu       = $(this);
        const $submenuToggle = $submenu.prev('.nav__link');
        const $parentItem    = $submenu.closest('.nav__item');
        const $submenuClose  = $submenu.find('.nav__link_back').first();
        const $firstLink     = $submenu
            .find('.nav__link')
            .not('.nav__link_back')
            .first();

        const onSubmenuToggle = toggleSubmenu.bind(
            null,
            $submenu,
            $submenuToggle
        );

        // Each submenu has two behavior patterns: drilldown menu for mobile
        // and dropdown menu for larger screens.
        const dropdownLogic  = makeDropdown($parentItem, $submenuToggle, {
            hoverToggles : true,
            onToggle     : onSubmenuToggle,
        });
        // By default, turn off the dropdown logic (mobile-first approach)
        dropdownLogic.pause();

        const drilldownLogic = makeDrilldown($submenu, $submenuToggle, {
            initialFocus : $firstLink,
            onToggle     : onSubmenuToggle,
        });

        $submenuClose.click(function onSubmenuClose() {
            drilldownLogic.hide();
        });

        $submenu.data('dropdown',  dropdownLogic);
        $submenu.data('drilldown', drilldownLogic);
    });

    // Scroll smoothly to internal links
    $nav.on('click', '.nav__link[href^="#"]', function onInternalLink(event) {
        event.preventDefault();

        const targetId = $(this).attr('href');
        const $target  = $(targetId);
        if ($target.length === 0) {
            return;
        }

        if (isMobile) {
            $submenus.each(function() {
                $(this).data('drilldown').hide();
            });
            menuDrilldown.hide();
        }

        $('html, body').animate({
            scrollTop: Math.max(0, $target.offset().top - 100),
        }, 1000, 'swing', function() {
            $target.focus();
        });
    });
    // end initialize submenus
};

/**
 * Respond to window resize event.
 */
export const handleResize = function() {
    // Switch between drilldown submenus on mobile and dropdown submenus on
    // desktop
    if (!isMobile && ($(window).outerWidth() < DESKTOP_BREAKPOINT)) {
        isMobile = true;

        $submenus.each(function() {
            $(this).data('dropdown').hide().pause();
            $(this).data('drilldown').unpause();
        });
    } else if (isMobile && ($(window).outerWidth() >= DESKTOP_BREAKPOINT)) {
        isMobile = false;

        $submenus.each(function() {
            $(this).data('drilldown').hide().pause();
            $(this).data('dropdown').unpause();
        });

        menuDrilldown.hide();
    }
};
// ----------------------------- END PUBLIC METHODS ---------------------------
