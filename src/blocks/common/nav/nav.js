/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import {makeModal, makeDropdown} from '../../../js/utils';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
let menuModal = null;
const submenus = [];
// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Initialize the navigation block.
 * @return true
 */
export const initModule = function() {
    const $nav       = $('.nav');
    const $toggle    = $('.nav__toggle',     $nav);
    const $menu      = $('.nav__menu',       $nav);
    const $menuInner = $('.nav__menu-inner', $menu);
    const $submenus  = $('.nav__submenu',    $menuInner);

    let isExpanded = false;

    menuModal = makeModal($nav, {
        onToggle(open) {
            $toggle
                .toggleClass('hamburger_open', open)
                .attr('aria-expanded', String(open));
    
            $menu.toggleClass('nav__menu_visible', open);

            isExpanded = open;
        }
    });

    $toggle.click(function() {
        if (isExpanded) {
            menuModal.hide();
        } else {
            menuModal.show();
        }
    });

    // Begin init submenus
    $submenus.each(function() {
        const $submenu = $(this);
        const $parentItem = $submenu.closest('.nav__item');
        const $parentLink = $parentItem.find('.nav__link').first();
        const $arrowOpen  = $parentLink.find('.nav__arrow_open').first();
        const $arrowClose = $submenu.find('.nav__arrow_close').first();

        // On mobile screens, submenus behave like modals
        const submenuModal = makeModal($submenu, {
            initialFocus : $submenu.find('.nav__link').first().get(0),
            onToggle(open) {
                $submenu.toggleClass('nav__submenu_visible', open);
                $arrowOpen.attr('aria-expanded', String(open));
            },
        });
        $arrowClose.click(function() {
            submenuModal.hide();
        });
        $arrowOpen.click(function() {
            submenuModal.show();
        });

        // On desktop screens, submenus behave like dropdowns
        const submenuDropdown = makeDropdown($parentItem, $parentLink, {
            hoverToggles: true,
            onToggle(open) {
                $submenu.toggleClass('nav__submenu_visible', open);
            },
        });
        submenuDropdown.pause();

        submenus.push({
            dropdown : submenuDropdown,
            modal    : submenuModal
        });
    });
    // End init submenus
};

/**
 * Respond to window resize event.
 *
 * @param {boolean} isMobile - If true, switch to mobile layout. If false,
 * switch to desktop layout
 */
export const handleResize = function(isMobile) {
    if (!isMobile) {
        // On desktop screens, disable the modal behavior of submenus and enable
        // the dropdown behavior
        submenus.forEach(function(submenu) {
            submenu.modal.hide();
            submenu.dropdown.unpause();
        });

        menuModal.hide();
    } else if (isMobile) {
        // On mobile screens, disable the dropdown behavior of submenus and
        // enable the modal behavior
        submenus.forEach(function(submenu) {
            submenu.dropdown.hide();
            submenu.dropdown.pause();
        });
    }
};
// ----------------------------- END PUBLIC METHODS ---------------------------
