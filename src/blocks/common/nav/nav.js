/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import {makeDropdown, makeDrilldown} from '../../../js/utils';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
let $nav, $menuToggle, $menu, $menuInner, $submenus;
let menuDrilldown;
// --------------------------- END MODULE VARIABLES ---------------------------

// ----------------------------- BEGIN DOM METHODS ----------------------------
const toggleMenu = function(open) {
    $menu.toggleClass('nav__menu_visible', open);
    $menuInner.scrollTop(0);

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
    $nav        = $('.nav');
    $menuToggle = $nav.find('.nav__toggle');
    $menu       = $nav.find('.nav__menu');
    $menuInner  = $menu.find('.nav__menu-inner');
    $submenus   = $nav.find('.nav__submenu');

    menuDrilldown = makeDrilldown($nav, $menuToggle, {
        onToggle: toggleMenu,
    });

    // begin initialize submenus
    $submenus.each(function() {
        const $submenu       = $(this);
        const $submenuToggle = $submenu.prev('.nav__link');
        const $parentItem    = $submenu.closest('.nav__item');
        const $submenuClose  = $submenu.find('.nav__arrow_close').first();

        const onSubmenuToggle = toggleSubmenu.bind(
            null,
            $submenu,
            $submenuToggle
        );

        const dropdownLogic  = makeDropdown($parentItem, $submenuToggle, {
            hoverToggles : true,
            onToggle     : onSubmenuToggle,
        });
        dropdownLogic.pause();

        const drilldownLogic = makeDrilldown($submenu, $submenuToggle, {
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
