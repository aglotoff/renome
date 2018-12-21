/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import {makeDropdown, makeDrilldown} from '../../../js/utils';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
let $nav, $menuToggle, $menu, $scrollpanes, $submenus;
let menuDrilldown;
// --------------------------- END MODULE VARIABLES ---------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------
const toggleMenu = function(open) {
    $menu.toggleClass('nav__menu_visible', open);
    $scrollpanes.scrollTop(0);

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
    // end initialize submenus
};

/**
 * Respond to window resize event.
 *
 * @param {boolean} isMobile - If true, switch to mobile layout. If false,
 * switch to desktop layout
 */
export const handleResize = function(isMobile) {
    // Switch between drilldown submenus on mobile and dropdown submenus on
    // desktop
    if (isMobile) {
        $submenus.each(function() {
            $(this).data('dropdown').hide().pause();
            $(this).data('drilldown').unpause();
        });
    } else {
        $submenus.each(function() {
            $(this).data('drilldown').hide().pause();
            $(this).data('dropdown').unpause();
        });

        menuDrilldown.hide();
    }
};
// ----------------------------- END PUBLIC METHODS ---------------------------
