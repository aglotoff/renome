/**
 * @file Implementation of the Page block
 * @author Andrey Glotov
 */

import * as Header from '../header/header';
import * as Nav from '../nav/nav';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const STICKY_HEADER_OFFSET  = 100;  // Scroll offset to make the header "sticky"
const VISIBLE_HEADER_OFFSET = 500;  // Scroll offset to show the "sticky" header
const RESIZE_INTERVAL       = 200;  // Resize throttling interval

const HeaderStates = {NORMAL: 0, STICKY: 1, VISIBLE: 2};

const $header = $('.header');

const isHeaderTransparent = $header.hasClass('header_transparent');
let headerState = HeaderStates.NORMAL;

let resizeTimer = null;
// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN DOM METHODS -----------------------------
/**
 * Add or remove header classes basd on the current scroll offset to create an
 * animated sticky header effect.
 */
const updateHeaderStyles = function() {
    const offset = $(window).scrollTop();
    const newState = offset < STICKY_HEADER_OFFSET
        ? HeaderStates.NORMAL
        : (offset < VISIBLE_HEADER_OFFSET
            ? HeaderStates.STICKY
            : HeaderStates.VISIBLE);

    if (newState !== headerState) {
        if (newState === HeaderStates.NORMAL) {
            $header
                .removeClass('page__header_scroll')
                .removeClass('page__header_hidden')
                .toggleClass('header_transparent', isHeaderTransparent);
        } else {
            $header
                .addClass('page__header_scroll')
                .toggleClass(
                    'page__header_hidden',
                    newState === HeaderStates.STICKY
                )
                .removeClass('header_transparent');
        }

        headerState = newState;
    }
};
// ----------------------------- END DOM METHODS ------------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------
const handleScroll = function() {
    updateHeaderStyles();
};

const handleResize = function() {
    Header.handleResize();
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
export const initModule = function() {
    // Initialize handlers for custom global events
    $('.page')
        .on('showNav', function() {
            Nav.toggleMenu(true);
        })
        .on('hideNav', function() {
            Nav.toggleMenu(false);
        });

    // Initialize handlers for window scroll & resize events
    $(window)
        .on('scroll', handleScroll)
        .on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(handleResize, RESIZE_INTERVAL);
        });

    // Initialize all blocks
    Header.initModule();
    Nav.initModule();

    updateHeaderStyles();
};
// ---------------------------- END PUBLIC METHODS ----------------------------
