/**
 * @file Implementation of the navigation block
 * @author Andrey Glotov
 */

import {Toggleable} from '../../../js/utils';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
let $toggle, $menu, $menuInner, $submenus;
let menuToggleable;
const submenus = [];
// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN DOM METHODS -----------------------------
const showMenu = function() {
    $toggle
        .addClass('hamburger_open')
        .attr('aria-expanded', 'true');
    
    $menu.addClass('nav__menu_visible');

    $menuInner.scrollTop(0);
};

const hideMenu = function() {
    $toggle
        .removeClass('hamburger_open')
        .attr('aria-expanded', 'false');

    $menu.removeClass('nav__menu_visible');
};

const toggleSubmenu = function($submenu, open) {
    $submenu
        .toggleClass('nav__submenu_visible', open)
        .prev('.nav__link')
        .attr('aria-expanded', String(open));
};
// ----------------------------- END DOM METHODS ------------------------------

// ---------------------------- BEGIN PUBLIC METHODS --------------------------
/**
 * Initialize the navigation menu block.
 * @return true
 */
export const initModule = function() {
    $toggle    = $('.nav__toggle');
    $menu      = $('.nav__menu');
    $menuInner = $('.nav__menu-inner', $menu);
    $submenus  = $('.nav__submenu', $menuInner);

    menuToggleable = new Toggleable(null, $toggle, $menu, {
        hoverToggles  : false,
        trapFocus     : true,
        onToggle      : function(open) {
            if (open) {
                showMenu();
            } else {
                hideMenu();
            }
        }
    });

    // For each submenu, define two different toggle behaviors - one for
    // mobile screens and another for desktop screens.
    $submenus.each(function() {
        const $submenu    = $(this);
        const $parentItem = $submenu.closest('.nav__item');
        const $parentLink = $parentItem.find('.nav__link').first();
        const $arrowClose = $submenu.find('.nav__arrow_close').first();

        const mobileToggleable = new Toggleable(
            null,
            $parentLink,
            $submenu,
            {
                hoverToggles : false,
                trapFocus    : true,
                initialFocus : $submenu.get(0),
                onToggle     : toggleSubmenu.bind(null, $submenu),
            }
        );

        $arrowClose.click(function() {
            mobileToggleable.hide();
        });

        const desktopToggleable = new Toggleable(
            $parentItem,
            $parentLink,
            $submenu,
            {onToggle: toggleSubmenu.bind(null, $submenu)}
        );
        desktopToggleable.pause();

        submenus.push({
            $elem: $submenu,
            mobileToggleable,
            desktopToggleable,
        });
    });
};

/**
 * Respond to window resize event.
 *
 * @param {boolean} isMobile - If true, switch to mobile layout. If false,
 * switch to desktop layout
 */
export const handleResize = function(isMobile) {
    if (!isMobile) {
        // Hide the nav menu.
        menuToggleable.hide();

        // Switch the submenu behavior for desktop screens.
        $.each(submenus, function() {
            toggleSubmenu(this.$elem, false);

            this.mobileToggleable.pause();
            this.desktopToggleable.unpause();
        });
    } else {
        // Switch the submenu behavior for mobile screens.
        $.each(submenus, function() {
            toggleSubmenu(this.$elem, false);

            this.mobileToggleable.unpause();
            this.desktopToggleable.pause();
        });
    }
};
// ----------------------------- END PUBLIC METHODS ---------------------------
