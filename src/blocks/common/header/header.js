/**
 * @file Implementation of the header block
 * @author Andrey Glotov
 */

import { show as showSearch } from '../search/search';
import { getEmSize, forceReflow, throttle } from '../../../js/util/index';

// -------------------------- BEGIN MODULE VARIABLES --------------------------

const STICKY_HEADER_OFFSET  = 6;    // Scroll offset to make the header "sticky"
const VISIBLE_HEADER_OFFSET = 32;   // Scroll offset to show the "sticky" header
const SCROLL_INTERVAL       = 200;  // Scroll throttling interval

const elements = {};
elements.$header = $('.header');
elements.$searchToggle = $('.header__search-toggle', elements.$header);

const isTransparent = elements.$header.hasClass('header_transparent');

const HeaderStates = { NORMAL: 0, STICKY: 1, VISIBLE: 2 };
let headerState = HeaderStates.NORMAL;

// --------------------------- END MODULE VARIABLES ---------------------------

// ---------------------------- BEGIN DOM METHODS -----------------------------

/**
 * Add or remove header classes basd on the current scroll offset to create an
 * animated sticky header effect.
 */
function updateHeaderStyles() {
    const currentOffset = $(window).scrollTop() / getEmSize($('.page'));

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
                .removeClass('header_scroll header_hidden header_animated')
                .toggleClass('header_transparent', isTransparent);
        } else if (newState === HeaderStates.STICKY) {
            $header
                .addClass('header_scroll header_hidden')
                .removeClass('header_transparent');
                
            forceReflow($header);

            $header.addClass('header_animated');
        } else {    // HeaderStates.VISIBLE
            if (headerState === HeaderStates.NORMAL) {
                // Make sure the animation is played
                $header
                    .addClass('header_scroll header_hidden')
                    .removeClass('header_transparent');

                forceReflow($header);

                $header.addClass('header_animated');
            }
            
            $header.removeClass('header_hidden');
        }

        headerState = newState;
    }
}

// ----------------------------- END DOM METHODS ------------------------------

// --------------------------- BEGIN EVENT HANDLERS ---------------------------

function handleSearchToggle() {
    showSearch();
}

/**
 * Respond to window scroll event.
 */
function handleWindowScroll() {
    updateHeaderStyles();
}

// ---------------------------- END EVENT HANDLERS ----------------------------

elements.$searchToggle.click(handleSearchToggle);

$(window).scroll(throttle(handleWindowScroll, SCROLL_INTERVAL));

handleWindowScroll();
