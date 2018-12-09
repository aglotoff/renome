/**
 * @file Implementation of the page block
 * @author Andrey Glotov
 */

import * as Nav from '../nav/nav';
import * as Search from '../search/search';
import * as Minicart from '../mini-cart/mini-cart';

import * as Slider from '../../index/slider/slider';

// -------------------------- BEGIN MODULE VARIABLES --------------------------
const DESKTOP_BREAKPOINT    = 992;  // Minimum desktop screen width
const STICKY_HEADER_OFFSET  = 100;  // Scroll offset to make the header "sticky"
const VISIBLE_HEADER_OFFSET = 500;  // Scroll offset to show the "sticky" header
const RESIZE_INTERVAL       = 200;  // Resize debouncing interval
const SCROLL_INTERVAL       = 200;  // Scroll throttling interval

const HeaderStates = {NORMAL: 0, STICKY: 1, VISIBLE: 2};
let headerState = HeaderStates.NORMAL;

const $header = $('.header');
const isHeaderTransparent = $header.hasClass('header_transparent');

let isMobile    = true;
let resizeTimer = null;
let scrollTimer = null;
let wasScrolled = false;
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
const onWindowScroll = function() {
    updateHeaderStyles();
};

const onWindowResize = function() {
    if (!isMobile && ($(window).outerWidth() < DESKTOP_BREAKPOINT)) {
        isMobile = true;

        Nav.handleResize(true);
    } else if (isMobile && ($(window).outerWidth() >= DESKTOP_BREAKPOINT)) {
        isMobile = false;

        Nav.handleResize(false);
    }
};
// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------
/**
 * Initialize the page module.
 * @return true
 */
export const initModule = function() {
    // Initialize handlers for window scroll & resize events
    $(window).on({
        // Debounce the window resize event 
        resize: function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(onWindowResize, RESIZE_INTERVAL);
        },

        // Throttle the window scroll event
        scroll: function() {
            if (scrollTimer) {
                // Ensure that we catch and execute that last invocation
                wasScrolled = true;
                return;
            }

            onWindowScroll();

            scrollTimer = this.setTimeout(function() {
                scrollTimer = null;
                if (wasScrolled) {
                    onWindowScroll();
                    wasScrolled = false;
                }
            }, SCROLL_INTERVAL);
        },
    });

    // Initialize all blocks
    Nav.initModule();
    Search.initModule();
    Minicart.initModule();
    Slider.initModule();

    // Process the initial window size and scroll position
    onWindowResize();
    onWindowScroll();

    return true;
};
// ---------------------------- END PUBLIC METHODS ----------------------------
