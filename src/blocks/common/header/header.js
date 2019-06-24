/**
 * @file Implementation of the header block
 * @author Andrey Glotov
 */

import * as Search from '../search/search';
import * as MiniCart from '../mini-cart/mini-cart';

import forceReflow from '../../../js/utils/force-reflow';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const STICKY_HEADER_OFFSET  = 100;  // Scroll offset to make the header "sticky"
const VISIBLE_HEADER_OFFSET = 500;  // Scroll offset to show the "sticky" header

const elements = {};
let isTransparent;

const HeaderStates = { NORMAL: 0, STICKY: 1, VISIBLE: 2 };
let headerState = HeaderStates.NORMAL;

// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN DOM METHODS -----------------------------

/**
 * Add or remove header classes basd on the current scroll offset to create an
 * animated sticky header effect.
 */
function updateHeaderStyles() {
    const currentOffset = $(window).scrollTop();

    let newState = null;
    if (currentOffset < STICKY_HEADER_OFFSET) {
        newState = HeaderStates.NORMAL;
    } else if (currentOffset < VISIBLE_HEADER_OFFSET) {
        newState = HeaderStates.STICKY;
    } else {
        newState = HeaderStates.VISIBLE;
    }

    if (newState !== headerState) {
        const { $header } = elements;

        if (newState === HeaderStates.NORMAL) {
            $header
                .removeClass('header_scroll header_hidden')
                .toggleClass('header_transparent', isTransparent);
        } else if (newState === HeaderStates.STICKY) {
            $header
                .addClass('header_scroll header_hidden')
                .removeClass('header_transparent');
        } else {    // HeaderStates.VISIBLE
            if (headerState === HeaderStates.NORMAL) {
                // Make sure the animation is played
                $header
                    .addClass('header_scroll header_hidden')
                    .removeClass('header_transparent');

                forceReflow($header);
            }
            
            $header.removeClass('header_hidden');
        }

        headerState = newState;
    }
}

// ----------------------------- END DOM METHODS ------------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------

function handleSearchToggle() {
    Search.show();
}

// ---------------------------- END EVENT HANDLERS ----------------------------

// --------------------------- BEGIN PUBLIC METHODS ---------------------------

/**
 * Initialize the header module.
 */
export function initBlock() {
    elements.$header = $('.header');
    elements.$searchToggle = $('.header__search-toggle', elements.$header);

    isTransparent = elements.$header.hasClass('header_transparent');

    Search.initBlock();
    MiniCart.initBlock();

    elements.$searchToggle.click(handleSearchToggle);
}

/**
 * Respond to window scroll event.
 */
export function handleScroll() {
    updateHeaderStyles();
}

// ---------------------------- END PUBLIC METHODS ----------------------------
